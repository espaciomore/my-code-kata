import requests
import oauth

def get_records(studyID, domain='us'):
	ACCESS_TOKEN = oauth.get_token(domain)['access_token']
	BASE_URL = 'https://' + ('data' if domain == 'us' else domain) + '.castoredc.com'
	RECORDS = '/api/study/' + studyID + '/record'

	headers = {
		'Authorization': 'Bearer ' + ACCESS_TOKEN
	}

	response = requests.get(url = BASE_URL + RECORDS, headers = headers)

	records = response.json()

	return records

def get_record(Id, studyID, domain='us'):
	collection = get_records(studyID)

	record = collection['_embebbed']['record']

	record = select_from(records, attribute='id', value=Id)[0]

	return record

def select_from(records, attribute, value):
	for record in records:
		if record[attribute] == value:
			return record
	return []	
	
