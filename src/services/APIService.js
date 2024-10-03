import deepmerge from 'deepmerge'

import APIFileService from './APIFileService'
import ClipGetter from './ClipGetter'
import ModelGetter from './ModelGetter'

export default class APIService {
	constructor() {
		this.baseUrl = "https://midi-practice.herokuapp.com"
		// this.baseUrl = "http://localhost:8000"
		this.access = localStorage.getItem('access_token')
		console.log("access", this.access)
		if (this.access !== null) {
			this.userPromise = this.apiCall(`/api/current_user/`)
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
		this.allClips = new ClipGetter(this)
		this.labelGetter = new ModelGetter(this, `/api/labels/`)
		this.rawSessionFilesGetter = new ModelGetter(this, `/api/rawsessionfiles/`)
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

	apiCall(path, params = {}, searchParams = {}, json = true) {
		const url = new URL(`${this.baseUrl}${path}`);
		if (this.demoUser) {
		  url.searchParams.append('user', this.demoUser);
		}
		for (const key in searchParams) {
		  const value = decodeURIComponent(searchParams[key]);
		  console.log(key, value);
		  url.searchParams.append(key, value);
		}

		let headers = {
		  'Content-Type': 'application/json'
		};

		if (!this.demo) {
		  const token = localStorage.getItem('access_token');
		  console.log("token", token)
		  if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		  }
		}

		let options = {
		  ...params,
		  headers: {
			...headers,
			...params.headers
		  }
		};

		if (json) {
		  options.body = JSON.stringify(options.body);
		}

		return fetch(url, options)
		  .then(response => {
			if (!response.ok) {
			  // If the response is a 401 (Unauthorized), the token might be expired
			  if (response.status === 401) {
				// Attempt to refresh the token
				return this.refreshToken().then(success => {
				  if (success) {
					// If refresh was successful, retry the original request
					return this.apiCall(path, params, searchParams, json);
				  } else {
					// If refresh failed, throw an error or handle as needed
					throw new Error('Authentication failed');
				  }
				});
			  }
			  throw new Error('Network response was not ok');
			}
			return response.json();
		  });
	  }

	  refreshToken() {
		const refreshToken = localStorage.getItem('refresh_token');
		if (!refreshToken) {
		  return Promise.resolve(false);
		}

		return fetch(`${this.baseUrl}/api/token/refresh/`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ refresh: refreshToken }),
		})
		  .then(response => {
			if (!response.ok) {
			  throw new Error('Token refresh failed');
			}
			return response.json();
		  })
		  .then(data => {
			localStorage.setItem('access_token', data.access);
			return true;
		  })
		  .catch(error => {
			console.error('Error refreshing token:', error);
			// Clear tokens on refresh failure
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			return false;
		  });
	  }

	handle_login(data) {
		return fetch(`${this.baseUrl}/api/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(json => {
				console.log("json", json)
				localStorage.setItem('access_token', json.access);
				localStorage.setItem('refresh_token', json.refresh);
				if (json.access !== null) {
					return "logged in?"
				}
				return false
			});
	}

	handle_logout = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
	};

	getStatus() {
		return this.apiCall(`/api/status/`)
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
			this.clipsForLabel[label] = new ClipGetter(this)
			this.clipsForLabel[label].modelGetter.searchParams = { label: label }
		}
		this.clipGetter = this.clipsForLabel[label]
	}

	loadRawSessionFiles(startTime, endTime) {
		this.rawSessionFilesGetter = new ModelGetter(this, `/api/rawsessionfiles/`)
		if (startTime && endTime) {
			this.rawSessionFilesGetter.searchParams = {
				start_time: startTime,
				end_time: endTime
			}
		}
		return this.rawSessionFilesGetter.loadItems()
	}

	uploadFileFlow(file, lastModified, metadata, piece) {
		return this.fileService.uploadFileFlow(file, lastModified, metadata, piece)
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
		return this.apiCall(`/api/stats/`)
			.then(response => {
				return response
			})
			.catch(error => console.log("error: " + error));
	}

	editClip(id, body) {
		return this.apiCall(`/api/midiclips/${id}/`, {
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
		return this.apiCall(`/api/midiclips/${id}/`, {
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
		const url = `/api/label_item/${id}/${label}/`
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}

	getSettings() {
		const url = `/api/settings/`
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}

	setSettings(body) {
		const url = `/api/settings/`
		return this.apiCall(url, {
			method: 'PUT',
			body: JSON.stringify(body)
		}).catch(error => console.log("error: " + error));
	}

	getTempo(clip_id) {
		return this.apiCall(`/api/tempo/${clip_id}`).catch(error => console.log("error: " + error));
	}
}
