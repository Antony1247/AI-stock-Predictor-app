# backend/sentiment_agent/Dockerfile
FROM python:3.11-slim

# Set up working directory
WORKDIR /app

# Install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose the port used by FastAPI
EXPOSE 8002

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"]
