import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import ModelGetter from './ModelGetter'

export default class ClipGetter {
	constructor(api, url) {
		this.hasMore = true
		this.modelGetter = new ModelGetter(api, url)
	}

	loadClips() {
		return this.modelGetter.loadItems()
		.then(items => {
			const sessions = this.createSessions(items)
			const clipgroupsets = this.transform(sessions)
			this.hasMore = this.modelGetter.hasMore
			return clipgroupsets
		})
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
}
