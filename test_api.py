import urllib.request

try:
    r = urllib.request.urlopen('http://127.0.0.1:8000/api/recipes/')
    print('Status:', r.status)
    print('Content-Type:', r.headers.get('Content-Type'))
    data = r.read(500).decode()
    print('Data:', data)
except Exception as e:
    print('Error:', type(e).__name__, '-', e)
