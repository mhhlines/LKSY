FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY mcp-server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY mcp-server/src ./src

EXPOSE 8000

CMD ["python", "src/server.py"]


