# LKSY MCP Server

Model Context Protocol server for lksy.org QA standards.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export GITHUB_TOKEN=your_token
export GITHUB_OWNER=lksy-org
export GITHUB_REPO=community-standards
```

3. Run the server:
```bash
python src/server.py
```

## Tools

- `get_qa_list`: Retrieve a QA standards list by ID
- `search_lists`: Search for lists by keyword or tag
- `validate_against_list`: Validate content against a specific list

## Resources

- `lksy://qa-lists/{list-id}`: Access list data as a resource


