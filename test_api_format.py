import urllib.request
import json

try:
    r = urllib.request.urlopen('http://127.0.0.1:8000/api/recipes/')
    data = json.loads(r.read().decode())
    print('API Response Format:')
    print('Keys:', list(data.keys()))
    print('Count:', data.get('count'))
    print('Results length:', len(data.get('results', [])))
    if data.get('results'):
        print('\nFirst result keys:', list(data['results'][0].keys()))
        print('First result ingredients type:', type(data['results'][0].get('ingredients')))
except Exception as e:
    print('Error:', type(e).__name__, '-', e)
