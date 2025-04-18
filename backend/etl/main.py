import requests
import pandas as pd
import sqlite3
from datetime import datetime
import os

# Connect to SQLite database
db_path = os.path.join(os.getcwd(), "db.sqlite3")  # Adjust path if needed
conn = sqlite3.connect(db_path)

cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS crypto_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    price REAL,
    volume REAL,
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
            "INSERT INTO crypto_prices (symbol, price, volume, timestamp) VALUES (?, ?, ?, ?)",
            (
                coin["symbol"],
                coin["current_price"],
                coin["total_volume"],
                datetime.now()
            )
        )
    conn.commit()

fetch_crypto()
conn.close()