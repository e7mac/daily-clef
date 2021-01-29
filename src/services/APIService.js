import ClipGetter from './ClipGetter'
import ModelGetter from './ModelGetter'
import APIFileService from './APIFileService'
import deepmerge from 'deepmerge'

export default class APIService {
	constructor() {
		this.baseUrl = "https://midi-practice.herokuapp.com"
		// this.baseUrl = "http://localhost:8000"
		this.userPromise = this.apiCall(`${this.baseUrl}/api/current_user/`)
		.then(
			(response) => {
				console.log("get user")
				if (response.username.length > 0) {
					return response
				} else {
					return null
				}
			})
		.catch(error => console.log("error: " + error));

		this.demo = false
		const urlParams = new URLSearchParams(window.location.search);
		this.demoUser = urlParams.get('user');
		const u = this.demoUser
		if (u!==null) {
			this.demo = true
			console.log(u)
			this.allClips = new ClipGetter(this, `${this.baseUrl}/api/user/journal/${u}/`)
			this.labelGetter = new ModelGetter(this, `${this.baseUrl}/api/user/labels/${u}/`)
			this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/user/rawsessionfiles/${u}/`)
		} else {
			this.allClips = new ClipGetter(this, `${this.baseUrl}/api/journal/`)
			this.labelGetter = new ModelGetter(this, `${this.baseUrl}/api/labels/`)
			this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/rawsessionfiles/`)
		}
		this.clipGetter = this.allClips

		this.clipsForLabel = {}
		this.fileService = new APIFileService(this)
	}

	getUser() {
		if (this.demo) {
			return null
		}
		return this.userPromise
	}

	apiCall(url, params = {}) {
		let auth = {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		}
		if (this.demo) {
			auth = {}
		}
		const fullParams = deepmerge(params, auth);
		return fetch(url, fullParams).then(res => res.json())
		.then(res => {
			if (res["detail"]!==undefined) {
				console.log(`LOGOUT from: ${url}`)
				localStorage.removeItem('token');
			}
			return res
		})
	}

	handle_login(data) {
		return fetch(`${this.baseUrl}/token-auth/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then(json => {
			localStorage.setItem('token', json.token);
			if (json.token !== null) {
				return json.user.username
			}
			return false
		});
	}

	handle_logout = () => {
		localStorage.removeItem('token');
	};

	getStatus() {
		return this.apiCall(`${this.baseUrl}/api/status/`)
		.catch(error => console.log("error: " + error));
	}

	loadLabels() {
		return this.labelGetter.loadItems()
	}

	resetLoadClips() {
		const u = this.demoUser
		if (u!==null) {
			this.allClips = new ClipGetter(this, `${this.baseUrl}/api/user/journal/${u}/`)
			this.labelGetter = new ModelGetter(this, `${this.baseUrl}/api/user/labels/${u}/`)
			this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/user/rawsessionfiles/${u}/`)
			this.demo = true
		} else {
			this.allClips = new ClipGetter(this, `${this.baseUrl}/api/journal/`)
			this.labelGetter = new ModelGetter(this, `${this.baseUrl}/api/labels/`)
			this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/rawsessionfiles/`)
		}
		this.clipGetter = this.allClips
	}

	loadClipsForLabel(label) {
		// if (!(label in this.clipsForLabel)) {
			if (this.demo) {
				this.clipsForLabel[label] = new ClipGetter(this, `${this.baseUrl}/api/user/journal/item/${this.demoUser}/${label}/`)
			} else {
				this.clipsForLabel[label] = new ClipGetter(this, `${this.baseUrl}/api/journal/item/${label}/`)
			}			
		// }
		this.clipGetter = this.clipsForLabel[label]
		console.log(this.clipGetter)
	}

	loadRawSessionFiles() {
		return this.rawSessionFilesGetter.loadItems()
	}

	uploadFileFlow(file, lastModified) {
		return this.fileService.uploadFileFlow(file, lastModified)
	}

	editClip(id, body, csrfToken) {
		return this.apiCall(`${this.baseUrl}/api/midiclips/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			body: JSON.stringify(body)
		})
		.then(response => {
			console.log(response)
		})
		.catch(error => console.log("error: " + error));
	}	

	relabelItem(id, label) {
		const url = `${this.baseUrl}/api/label_item/${id}/${label}/`
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}
}