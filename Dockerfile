# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Install system dependencies for Python
# build-essential is often needed for installing Python packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# --- Python Environment Setup ---
# Create a virtual environment for Python
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy ML Engine requirements first to cache dependencies
COPY ml_engine/requirements.txt ./ml_engine/requirements.txt

# Install Python dependencies and the specific Spacy model required
RUN pip install --no-cache-dir -r ml_engine/requirements.txt && \
    python -m spacy download en_core_web_sm

# --- Node.js Server Setup ---
# Copy server package files
COPY server/package*.json ./server/

# Install Node dependencies
WORKDIR /app/server
RUN npm install

# --- Application Code & Final Setup ---
WORKDIR /app
# Copy the rest of the application code
COPY ml_engine ./ml_engine
COPY server ./server

# Create uploads directory for the server
RUN mkdir -p /app/server/uploads

# Copy the start script
COPY start-services.sh .
RUN chmod +x start-services.sh

# Expose the port Render will use (default is usually 10000)
# Node server will listen on process.env.PORT
ENV PORT=10000
EXPOSE 10000

# Start command
CMD ["./start-services.sh"]
