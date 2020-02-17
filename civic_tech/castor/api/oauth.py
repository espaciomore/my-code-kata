import requests
import os

def get_token(domain='us'):
	CLIENT_ID = os.environ.get('CLIENT_ID')
	CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
	BASE_URL = 'https://' + ('data' if domain == 'us' else domain) + '.castoredc.com'
	AUTH_TOKEN = '/oauth/token'

	data = {
	  'client_id': CLIENT_ID,
	  'client_secret': CLIENT_SECRET,
	  'grant_type': 'client_credentials'
	}

	response = requests.post(url = BASE_URL + AUTH_TOKEN, data = data)

	token = response.json()

	return token
