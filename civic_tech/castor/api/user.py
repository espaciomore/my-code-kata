import requests
import oauth

def get_users(domain='us'):
	ACCESS_TOKEN = oauth.get_token(domain)['access_token']
	BASE_URL = 'https://' + ('data' if domain == 'us' else domain) + '.castoredc.com'
	USER = '/api/user'

	headers = {
		'Authorization': 'Bearer ' + ACCESS_TOKEN
	}

	response = requests.get(url = BASE_URL + USER, headers = headers)

	users = response.json()

	return users

def get_user(id, domain='us'):
	ACCESS_TOKEN = oauth.get_token(domain)['access_token']
	BASE_URL = 'https://' + ('data' if domain == 'us' else domain) + '.castoredc.com'
	USER = '/api/user/'

	headers = {
		'Authorization': 'Bearer ' + ACCESS_TOKEN
	}

	response = requests.get(url = BASE_URL + USER + id, headers = headers)

	user = response.json()

	return user
