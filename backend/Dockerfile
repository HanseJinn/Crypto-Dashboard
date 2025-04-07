FROM python:3.11-slim

WORKDIR /app

# ⬇️ Wichtige system packages für mysqlclient (und generell Build)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        pkg-config \
        default-libmysqlclient-dev \
        build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

CMD ["python","etl.py", "manage.py", "runserver", "0.0.0.0:8000"]