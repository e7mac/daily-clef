import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import ModelGetter from './ModelGetter'

const DURATION_BETWEEN_SESSIONS_COMBINE = 6 * 60 * 60;

export default class ClipGetter {
	constructor(api) {
		this.hasMore = true
		this.modelGetter = new ModelGetter(api, `/api/midiclips/`)
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

	loadMoreClips() {
		return this.modelGetter.loadMoreItems()
			.then(items => {
				const sessions = this.createSessions(items)
				const clipgroupsets = this.transform(sessions)
				this.hasMore = this.modelGetter.hasMore
				return clipgroupsets
			})
	}

	label(clip) {
		if (clip.label === null) {
			if (clip.sight_reading === true) {
				return "Sight Reading"
			} else if (clip.technical === true) {
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

	earliestTime(labelClips) {
		let time = Date.now()
		for (const key in labelClips) {
			const clips = labelClips[key]
			for (const clip of clips) {
				if (new Date(clip.date_played) < new Date(time)) {
					time = clip.date_played
				}
			}
		}
		return time
	}

	isEmptyObject(obj) {
		for (var prop in obj) {
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
		for (const clip of clips) {
			if (clip.title === null) {
				clip.title = ""
			}
			if (clip.notes === null) {
				clip.notes = ""
			}
			if (lastRaw === clip.run.id || this.isEmptyObject(labelClips)) {
				lastRaw = clip.run.id
				if (!(this.label(clip) in labelClips)) {
					labelClips[this.label(clip)] = []
				}
				labelClips[this.label(clip)].push(clip)
			} else {
				lastRaw = clip.run.id
				session = { "time": this.earliestTime(labelClips), "labels": this.create_json_format_for_labelclips(labelClips) }
				sessions.push(session)
				labelClips = {}
				labelClips[this.label(clip)] = []
				labelClips[this.label(clip)].push(clip)
			}
		}
		if (!this.isEmptyObject(labelClips)) {
			session = { "time": this.earliestTime(labelClips), "labels": this.create_json_format_for_labelclips(labelClips) }
			sessions.push(session)
		}
		return sessions
	}

	combineGroups(a, b) {
		let c = {}
		for (const arr of [a, b]) {
			for (const item of arr) {
				const label = item.name
				if (!c[label]) {
					c[label] = []
				}
				c[label] = c[label].concat(item.clips)
			}
		}
		let c_array = []
		for (const label in c) {
			c_array.push({
				name: label,
				clips: c[label]
			})
		}
		return c_array
	}

	transform(sessions) {
		let items = []
		let lastDate = new Date(2100, 1, 1, 0, 0, 0, 0)
		for (const i in sessions) {
			const session = sessions[i]
			const date = new Date(session.time)
			const dateDiff = (lastDate.getTime() - date.getTime()) / 1000;
			if (dateDiff < DURATION_BETWEEN_SESSIONS_COMBINE) {
				const prevClipgroupset = items[items.length - 1];
				const groups = this.combineGroups(session.labels, prevClipgroupset.groups)
				const newClipgroupset = {
					title: TimeFormatUtils.formatDateTime(session.time),
					date: session.time,
					groups: groups
				}
				items[items.length - 1] = newClipgroupset;
			} else {
				const clipgroupset = {
					title: TimeFormatUtils.formatDateTime(session.time),
					date: session.time,
					groups: session.labels
				}
				items.push(clipgroupset)
			}
			lastDate = date;
		}
		return items
	}

}
