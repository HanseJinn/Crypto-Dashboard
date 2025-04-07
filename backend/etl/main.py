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
