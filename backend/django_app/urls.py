from django.contrib import admin
from django.urls import path
from api.crypto_api import get_crypto_prices

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/crypto/prices/', get_crypto_prices),
    # TODO: Weitere API-Endpunkte hier einfügen
]