from django.db import models

# Create your models here.
class CryptoPrice(models.Model):
    symbol = models.CharField(max_length=10)
    price = models.FloatField()
    volume = models.FloatField()
    timestamp = models.DateTimeField()