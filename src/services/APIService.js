import deepmerge from 'deepmerge'

import APIFileService from './APIFileService'
import ClipGetter from './ClipGetter'
import ModelGetter from './ModelGetter'

export default class APIService {
	constructor() {
		this.baseUrl = "https://midi-practice.herokuapp.com"
		// this.baseUrl = "http://localhost:8000"
		this.token = localStorage.getItem('token')
		if (this.token !== null) {
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
		}
		this.demo = false
		const urlParams = new URLSearchParams(window.location.search);
		this.demoUser = urlParams.get('user');
		const u = this.demoUser
		this.allClips = new ClipGetter(this, `${this.baseUrl}/api/midiclips/`)
		this.labelGetter = new ModelGetter(this, `${this.baseUrl}/api/labels/`)
		this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/rawsessionfiles/`)
		if (u !== null) {
			this.demo = true
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

	apiCall(urlString, params = {}, searchParams = {}, json = true) {
		const url = new URL(urlString)
		if (this.demoUser) {
			url.searchParams.append('user', this.demoUser)
		}
		for (const key in searchParams) {
			const value = searchParams[key]
			url.searchParams.append(key, value)
		}
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
		const request = fetch(url, fullParams)
		if (json) {
			return request
				.then(res => {
					return res.json()
				})
				.then(res => {
					if (res["detail"] !== undefined) {
						console.log(`LOGOUT from: ${url}`)
						localStorage.removeItem('token');
						window.location.reload()
					}
					return res
				})
		} else {
			return request
		}

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
		this.clipGetter = this.allClips
	}

	loadClipsForLabel(label) {
		if (!(label in this.clipsForLabel)) {
			if (this.demo) {
				this.clipsForLabel[label] = new ClipGetter(this, `${this.baseUrl}/api/midiclips/?user=${this.demoUser}&label=${label}/`)
			} else {
				this.clipsForLabel[label] = new ClipGetter(this, `${this.baseUrl}/api/midiclips/?label=${label}/`)
			}
		}
		this.clipGetter = this.clipsForLabel[label]
	}

	loadRawSessionFiles(startTime, endTime) {
		this.rawSessionFilesGetter = new ModelGetter(this, `${this.baseUrl}/api/rawsessionfiles/`)
		if (startTime && endTime) {
			this.rawSessionFilesGetter.searchParams = {
				start_time: startTime,
				end_time: endTime
			}
		}
		return this.rawSessionFilesGetter.loadItems()
	}

	uploadFileFlow(file, lastModified) {
		return this.fileService.uploadFileFlow(file, lastModified)
	}

	readCsrfToken = () => {
		var name = "csrftoken"
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	stats() {
		let url = ""
		if (this.demo) {
			url = `${this.baseUrl}/api/stats/?user=${this.demoUser}`
		} else {
			url = `${this.baseUrl}/api/stats/`
		}
		return this.apiCall(url)
			.then(response => {
				return response
			})
			.catch(error => console.log("error: " + error));
	}

	editClip(id, body) {
		return this.apiCall(`${this.baseUrl}/api/midiclips/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': this.readCsrfToken()
			},
			body: JSON.stringify(body)
		})
			.then(response => {
				console.log(response)
			})
			.catch(error => console.log("error: " + error));
	}

	deleteClip(id,) {
		return this.apiCall(`${this.baseUrl}/api/midiclips/${id}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': this.readCsrfToken()
			}
		}, {}, false)
			.then(response => {
				console.log(response)
			})
			.catch(error => console.log("error: " + error));
	}

	relabelItem(id, label) {
		const url = `${this.baseUrl}/api/label_item/${id}/${label}/`
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}

	getSettings() {
		const url = `${this.baseUrl}/api/settings/`
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}

	setSettings(body) {
		const url = `${this.baseUrl}/api/settings/`
		return this.apiCall(url, {
			method: 'PUT',
			body: JSON.stringify(body)
		}).catch(error => console.log("error: " + error));
	}

}
