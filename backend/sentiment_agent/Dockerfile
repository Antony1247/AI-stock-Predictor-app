FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y libxml2-dev libxslt-dev python3-dev libjpeg-dev zlib1g-dev \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]