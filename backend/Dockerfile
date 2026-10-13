FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libssl-dev \
    libffi-dev \
    libbz2-dev \
    libgmp-dev \
    libsqlite3-dev \
    libpq-dev \
    liblzma-dev \
    libncurses5-dev \
    libncursesw5-dev \
    zlib1g-dev \
    pkg-config \
    wget curl git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade google-auth-oauthlib google-api-python-client

COPY . .

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
