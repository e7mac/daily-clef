import * as TimeFormatUtils from '../utils/TimeFormatUtils'

export default class APIService {
	constructor() {
		this.ownUsername = (window.location.pathname==="/" || window.location.pathname==="/daily-clef" || window.location.pathname==="/daily-clef/")
		this.hasMore = true

		this.clips = []
		this.labels = []
		this.rawSessionFiles = []

		// this.baseUrl = "https://midi-practice.herokuapp.com"
		this.baseUrl = "http://localhost:8000"

		this.url = '/api' + window.location.pathname
		this.urlPromise = null
		if (this.ownUsername === true) {
			this.url = "/api/journal"
		}
		this.labelsURL = '/api/labels'
		this.rawSessionFilesURL = '/api/rawsessionfiles'
		this.isLoggedInPromise = this.apiCall("/api/current_user")
	}

	handle_login(data) {
		return fetch('https://midi-practice.herokuapp.com/token-auth/', {
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

		;
	}

	  handle_logout = () => {
	    localStorage.removeItem('token');
	  };

	isLoggedIn() {
		return this.isLoggedInPromise
		.then(
			(response) => {
				if (response.username.length > 0) {
					return true
				} else {
					return false
				}
			})
		.catch(error => console.log("error: " + error));
		
	}

	status() {
		return this.apiCall("/api/status")
		.catch(error => console.log("error: " + error));
	}

	transform(sessions) {
		let items = []
		// let clipgroupset = {
		// }
		// if (this.state.url.includes("/item/")) {
		// 	let groups = []
		// 	for (const i in sessions) {
		// 		let clips = []
		// 		const session = sessions[i]
		// 		let group = {}
		// 		group.name = formatDateTime(session.time)
		// 		for (const j in session.labels) {
		// 			const label = session.labels[j]
		// 			clipgroupset.title = label.name
		// 			for (const k in label.clips) {
		// 				const clip = label.clips[k]
		// 				clips.push(clip)
		// 			}
		// 			group.clips = clips
		// 		}
		// 		groups.push(group)
		// 	}
		// 	clipgroupset.groups = groups
		// 	items.push(clipgroupset)
		// } else {
			for (const i in sessions) {
				const session = sessions[i]
				const clipgroupset = {
					title: TimeFormatUtils.formatDateTime(session.time), 
					date: session.time,
					groups: session.labels
				}
				items.push(clipgroupset)
			}
		// }
		return items
	}

	label(clip) {
		if (clip.label===null) {
			if (clip.sight_reading===true) {
				return "Sight Reading"
			} else if (clip.technical===true) {
				return "Technical"
			} else {
				return "No Label"
			}
		}
		return clip.label.name
	}

	create_json_format_for_labelclips(labelClips) {
		let clean = []
		for (const key in labelClips) {
			const value = labelClips[key]
			const d = {
				"name": key,
				"clips": value
			}
			clean.push(d)
		}
		return clean
	}

	isEmptyObject(obj) {
		for(var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				return false;
			}
		}
		return true;
	}

	createSessions(results) {
		const clips = results
		let lastRaw = null
		let labelClips = {}
		let sessions = []
		let session = {}
		let startTime = null
		for (const i in clips) {
			const clip = clips[i]
			if (this.isEmptyObject(labelClips)) {
				startTime = clip.date_played
			}
			if (lastRaw === clip.run.id || this.isEmptyObject(labelClips)) {
				lastRaw = clip.run.id
				if (!(this.label(clip) in labelClips)) {
					labelClips[this.label(clip)] = []
				}
				labelClips[this.label(clip)].push(clip)
			} else {
				lastRaw = clip.run.id
				session = {"time": startTime, "labels": this.create_json_format_for_labelclips(labelClips)}
				sessions.push(session)
				labelClips = {}
				labelClips[this.label(clip)] = []
				labelClips[this.label(clip)].push(clip)
				startTime = clip.date_played
			}
		}
		if (!this.isEmptyObject(labelClips)) {
			session = {"time": startTime, "labels": this.create_json_format_for_labelclips(labelClips)}
			sessions.push(session)
		}
		return sessions
	}	

	apiCall(path, params = {}) {
		const auth = {
			headers: {
				Authorization: `JWT ${localStorage.getItem('token')}`
			}
		}
		const fullParams = { ...params, ...auth};
		return fetch(this.baseUrl + path, fullParams).then(res => res.json())
		.then(res => {
			if (res["detail"]!==undefined) {
				console.log("LOGOUT")
				localStorage.removeItem('token');
				// location.reload();				
			}
			return res
		})
	}

	loadClips() {
		if (this.url!==null) {
			if (this.urlPromise === null) {
				this.urlPromise = this.apiCall(this.url)
				.then((response) => {
					this.clips = this.clips.concat(response.results);
					const sessions = this.createSessions(this.clips)
					const clipgroupsets = this.transform(sessions)
					this.hasMore = (response.next!==null)
					this.url = response.next
					this.urlPromise = null
					return clipgroupsets
				})
				.catch(error => console.log("error: " + error));
			}
			return this.urlPromise
		}
	}

	loadLabels() {
		if (this.labelsURL!==null) {
			return this.apiCall(this.labelsURL)
			.then((response) => {
				this.labels = this.labels.concat(response.results);
				this.labelsURL = response.next
				return this.labels
			})
			.catch(error => console.log("error: " + error));
		}
	}

	loadRawSessionFiles() {
		if (this.rawSessionFilesURL!==null) {
			return this.apiCall(this.rawSessionFilesURL)
			.then((response) => {
				this.rawSessionFiles = this.rawSessionFiles.concat(response.results);
				this.rawSessionFilesURL = response.next
				return this.rawSessionFiles
			})
			.catch(error => console.log("error: " + error));
		}
	}

	uploadFileFlow(file, lastModified) {
		let url = null
		return this.getSignedRequest(file)
		.then((response) => { 
			url = response.url
			return this.uploadFileToS3(file, response.data, response.url)})
		.then((response) => {
			const body = new FormData();
			body.append("file-url", url)
			body.append("lastModified", lastModified);
			body.append("submit", "Upload");
			return this.uploadFile(body)
		})
		.catch(error => console.log("error: " + error));
	}

	getSignedRequest(file) {
		return this.apiCall("/api/sign_s3?file_name="+file.name+"&file_type="+file.type)
	}

	uploadFileToS3(file, s3Data, url) {
		var postData = new FormData();
		for(const key in s3Data.fields){
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
		return this.apiCall('/api/upload', {
			method: 'POST',
			body: body
		})		
		.then(
			(response) => {
				console.log("uploaded!")
				return response
			})
		.catch(error => console.log("error: " + error));
	}

	editClip(id, body, csrfToken) {
		return this.apiCall('/api/midiclips/' + id + '/', {
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
		const url = 'api/label_item/' + id + '/' + label
		return this.apiCall(url).catch(error => console.log("error: " + error));
	}
}