#!/usr/bin/env python3
"""
MCP Server for lksy.org
Provides tools and resources for AI agents to access QA standards lists
"""

import os
import json
import httpx
from typing import Any, Sequence
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Resource, Tool, TextContent

# Configuration
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_OWNER = os.getenv('GITHUB_OWNER', 'mhhlines')
GITHUB_REPO = os.getenv('GITHUB_REPO', 'LKSY')
GITHUB_API_BASE = 'https://api.github.com'

# Initialize server
server = Server('lksy-mcp-server')

# Cache for lists
_lists_cache: dict[str, Any] = {}


async def fetch_list_from_github(list_id: str, version: str = 'latest') -> dict[str, Any] | None:
    """Fetch a list from GitHub"""
    try:
        path = f'repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/community-standards/lists/{list_id}.json'
        headers = {'Authorization': f'token {GITHUB_TOKEN}'} if GITHUB_TOKEN else {}
        
        params = {}
        if version != 'latest':
            params['ref'] = f'{list_id}-v{version}'
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{GITHUB_API_BASE}/{path}',
                headers=headers,
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            if 'content' in data:
                content = data['content']
                # GitHub returns base64 encoded content
                import base64
                decoded = base64.b64decode(content).decode('utf-8')
                return json.loads(decoded)
    except Exception as e:
        print(f"Error fetching list {list_id}: {e}")
        return None


async def fetch_all_lists() -> list[dict[str, Any]]:
    """Fetch all lists from GitHub"""
    try:
        path = f'repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/community-standards/lists'
        headers = {'Authorization': f'token {GITHUB_TOKEN}'} if GITHUB_TOKEN else {}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{GITHUB_API_BASE}/{path}',
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            
            if not isinstance(data, list):
                return []
            
            lists = []
            for item in data:
                if item.get('type') == 'file' and item.get('name', '').endswith('.json'):
                    list_id = item['name'].replace('.json', '')
                    list_data = await fetch_list_from_github(list_id)
                    if list_data:
                        lists.append(list_data)
            
            return lists
    except Exception as e:
        print(f"Error fetching all lists: {e}")
        return []


@server.list_resources()
async def list_resources() -> list[Resource]:
    """List available resources (lists)"""
    lists = await fetch_all_lists()
    
    return [
        Resource(
            uri=f'lksy://qa-lists/{list["id"]}',
            name=list["name"],
            description=list.get("description", ""),
            mimeType="application/json"
        )
        for list in lists
    ]


@server.read_resource()
async def read_resource(uri: str) -> str:
    """Read a resource (list)"""
    if not uri.startswith('lksy://qa-lists/'):
        raise ValueError(f"Unknown resource URI: {uri}")
    
    list_id = uri.replace('lksy://qa-lists/', '')
    
    # Check cache first
    if list_id in _lists_cache:
        return json.dumps(_lists_cache[list_id], indent=2)
    
    # Fetch from GitHub
    list_data = await fetch_list_from_github(list_id)
    if not list_data:
        raise ValueError(f"List not found: {list_id}")
    
    # Cache it
    _lists_cache[list_id] = list_data
    
    return json.dumps(list_data, indent=2)


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools"""
    return [
        Tool(
            name="get_qa_list",
            description="Retrieve a QA standards list by ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "list_id": {
                        "type": "string",
                        "description": "The ID of the list to retrieve"
                    },
                    "version": {
                        "type": "string",
                        "description": "Version to retrieve (default: latest)",
                        "default": "latest"
                    }
                },
                "required": ["list_id"]
            }
        ),
        Tool(
            name="search_lists",
            description="Search for lists by keyword or tag",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query (keyword or tag)"
                    },
                    "tags": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Filter by tags"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="validate_against_list",
            description="Validate content against a specific list",
            inputSchema={
                "type": "object",
                "properties": {
                    "list_id": {
                        "type": "string",
                        "description": "The ID of the list to validate against"
                    },
                    "content": {
                        "type": "string",
                        "description": "Content to validate"
                    }
                },
                "required": ["list_id", "content"]
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> Sequence[TextContent]:
    """Handle tool calls"""
    if name == "get_qa_list":
        list_id = arguments.get("list_id")
        version = arguments.get("version", "latest")
        
        if not list_id:
            return [TextContent(type="text", text="Error: list_id is required")]
        
        list_data = await fetch_list_from_github(list_id, version)
        if not list_data:
            return [TextContent(type="text", text=f"List not found: {list_id}")]
        
        return [TextContent(type="text", text=json.dumps(list_data, indent=2))]
    
    elif name == "search_lists":
        query = arguments.get("query", "").lower()
        tags = arguments.get("tags", [])
        
        all_lists = await fetch_all_lists()
        results = []
        
        for list_data in all_lists:
            # Search in name, description, and tags
            matches = False
            if query in list_data.get("name", "").lower():
                matches = True
            if query in list_data.get("description", "").lower():
                matches = True
            if any(query in tag.lower() for tag in list_data.get("tags", [])):
                matches = True
            
            # Filter by tags
            if tags:
                list_tags = [t.lower() for t in list_data.get("tags", [])]
                if not any(tag.lower() in list_tags for tag in tags):
                    matches = False
            
            if matches:
                results.append({
                    "id": list_data.get("id"),
                    "name": list_data.get("name"),
                    "description": list_data.get("description"),
                    "tags": list_data.get("tags", []),
                    "version": list_data.get("version")
                })
        
        return [TextContent(type="text", text=json.dumps(results, indent=2))]
    
    elif name == "validate_against_list":
        list_id = arguments.get("list_id")
        content = arguments.get("content", "")
        
        if not list_id:
            return [TextContent(type="text", text="Error: list_id is required")]
        
        list_data = await fetch_list_from_github(list_id)
        if not list_data:
            return [TextContent(type="text", text=f"List not found: {list_id}")]
        
        # Perform validation
        failed_checks = []
        
        if list_data.get("type") == "checks" and "checks" in list_data:
            checks = list_data["checks"]
            content_lower = content.lower()
            
            for check in checks:
                check_name = check.get("name", "").lower()
                check_desc = check.get("description", "").lower()
                
                # Simple validation: check if content contains patterns that would fail
                # This is a simplified example - real validation would be more sophisticated
                if check.get("detection_method") == "pattern_matching":
                    # Check for spam trigger words
                    if "free" in content_lower and "act now" in content_lower:
                        failed_checks.append({
                            "check": check.get("id"),
                            "name": check.get("name"),
                            "reason": "Contains spam trigger words"
                        })
        
        result = {
            "passed": len(failed_checks) == 0,
            "failed_checks": failed_checks,
            "total_checks": len(list_data.get("checks", [])) if list_data.get("type") == "checks" else 0
        }
        
        return [TextContent(type="text", text=json.dumps(result, indent=2))]
    
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def main():
    """Run the MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())

