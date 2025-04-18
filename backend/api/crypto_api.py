imports requests
from django.http import JsonResponse

def get_crypto_prices(request):
    # Aktuell feste Coins (TODO: später dynamisch machen via URL-Param)
    coins = ['bitcoin', 'ethereum']
    vs_currency = 'usd'
    url = 'https://api.coingecko.com/api/v3/simple/price'
    
    try:
        response = requests.get(url, params={
            'ids': ','.join(coins),
            'vs_currencies': vs_currency,
            'include_24hr_change': 'true'
        })
        data = response.json()

        result = []
        for coin in coins:
            result.append({
                'coin': coin,
                'price': data[coin][vs_currency],
                'change_24h': data[coin][f'{vs_currency}_24h_change'],
            })

        return JsonResponse({'data': result})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)