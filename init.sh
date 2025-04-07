#!/bin/bash

set -e

echo "🔧 Initialisiere Projektstruktur..."

mkdir -p backend/{etl,django_app}
mkdir -p frontend
touch .env docker-compose.yml

echo "🔑 Erstelle .env Datei..."
cat > .env <<EOF
DB_HOST=mysql
DB_PORT=3306
DB_NAME=crypto
DB_USER=root
DB_PASSWORD=root
EOF

echo "🐳 Erstelle docker-compose.yml..."
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  mysql:
    image: mysql:8
    container_name: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: crypto
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    container_name: backend
    command: bash -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - mysql
    env_file:
      - .env

  etl:
    build: ./backend/etl
    container_name: etl
    command: ["python", "main.py"]
    depends_on:
      - mysql
    env_file:
      - .env

  frontend:
    build: ./frontend
    container_name: frontend
    volumes:
      - ./frontend:/app
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mysql_data:
EOF

echo "📦 Django Backend Setup..."
cd backend
cat > requirements.txt <<EOF
Django==4.2
djangorestframework
mysqlclient
requests
pandas
EOF

cat > Dockerfile <<EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EOF

echo "🧱 Erstelle Django Projekt..."
django-admin startproject config .
python manage.py startapp api

echo "✅ Django Projekt erstellt (vergiss nicht settings.py & models etc. anzupassen!)"

echo "🔄 Erstelle ETL Pipeline..."
mkdir -p etl
cat > etl/Dockerfile <<EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EOF

cat > etl/main.py <<EOF
import requests
import pandas as pd
import MySQLdb
import os
from datetime import datetime

conn = MySQLdb.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    passwd=os.getenv("DB_PASSWORD"),
    db=os.getenv("DB_NAME"),
    port=int(os.getenv("DB_PORT"))
)

cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS crypto_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10),
    price FLOAT,
    volume FLOAT,
    timestamp DATETIME
)
""")

def fetch_crypto():
    res = requests.get("https://api.coingecko.com/api/v3/coins/markets", params={
        "vs_currency": "usd",
        "ids": "bitcoin,ethereum"
    }).json()

    for coin in res:
        cursor.execute(
            "INSERT INTO crypto_prices (symbol, price, volume, timestamp) VALUES (%s, %s, %s, %s)",
            (
                coin["symbol"],
                coin["current_price"],
                coin["total_volume"],
                datetime.now()
            )
        )
    conn.commit()

fetch_crypto()
EOF

cd ..

echo "⚛️ Vite + React + Tailwind Frontend Setup..."
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Tailwind config update
sed -i '' 's/content: \[\]/content: ["\.\/index\.html", "\.\/src\/\*\*\/\*\.{js,ts,jsx,tsx}"]/' tailwind.config.js || true

# index.css update
cat > src/index.css <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Frontend eingerichtet – du kannst jetzt loslegen!"

cd ..

echo "🚀 FERTIG! Starte mit: docker compose up --build"