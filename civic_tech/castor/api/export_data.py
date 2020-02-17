import requests
import oauth

def get_export_data(studyID, domain='us'):
	ACCESS_TOKEN = oauth.get_token(domain)['access_token']
	BASE_URL = 'https://' + ('data' if domain == 'us' else domain) + '.castoredc.com'
	PATH = '/api/study/' + studyID + '/export/data'

	headers = {
		'Authorization': 'Bearer ' + ACCESS_TOKEN
	}
	print(BASE_URL + PATH)
	response = requests.get(url = BASE_URL + PATH, headers = headers)

	data = response.json()
	
	return data