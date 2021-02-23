export default class APIFileService {
	constructor(api) {
		this.api = api
	}

	uploadFileFlow(file, lastModified, metadata, piece) {
		let url = null
		return this.getSignedRequest(file)
			.then((response) => {
				url = response.url
				return this.uploadFileToS3(file, response.data, response.url)
			})
			.then((response) => {
				const body = {
					"file-url": url,
					"lastModified": lastModified,
					"metadata": metadata,
					"piece": piece
				}
				return this.uploadFile(body)
			})
			.catch(error => console.log("error: " + error));
	}

	getSignedRequest(file) {
		return this.api.apiCall(`/api/sign_s3/?file_name=${file.name}&file_type=${file.type}`)
	}

	uploadFileToS3(file, s3Data, url) {
		var postData = new FormData();
		for (const key in s3Data.fields) {
			postData.append(key, s3Data.fields[key]);
		}
		postData.append('file', file);

		return fetch(s3Data.url, {
			method: 'POST',
			body: postData
		})
			.then(
				(response) => {
					console.log("uploaded to s3!")
					return response
				});
	}

	uploadFile(body) {
		return this.api.apiCall('/api/upload/', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(
				(response) => {
					console.log("uploaded!")
					return response
				})
			.catch(error => console.log("error: " + error));
	}
}