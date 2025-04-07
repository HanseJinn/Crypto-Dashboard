from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import CryptoPrice
from .serializers import CryptoPriceSerializer

class CryptoPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CryptoPrice.objects.all().order_by('-timestamp')[:20]
    serializer_class = CryptoPriceSerializer