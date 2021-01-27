import React, { useState } from 'react';

import ClipGroup from './ClipGroup';
import * as TimeFormatUtils from '../utils/TimeFormatUtils'

import './ClipGroupSet.css';

export default function ClipGroupSet(props) {

	const [groups, setGroups] = useState(props.set.groups)
	const [title, setTitle] = useState(props.set.title)

	let duration = 0
	groups.map((groups) => {
		groups.clips.map((clip) => {
			duration = duration + clip.duration
		})
	})

	return (
		<div className="card">
		<div className="container">
		<h3>{title + " (" + TimeFormatUtils.formatDuration(duration) + ")"}</h3>
		{
			groups.map((group, index) => {
				return (
				<ClipGroup api={props.api} key={group.name} group={group} onRelabel={props.onRelabel} onPlay={props.onPlay} />
				)
			})
		}
		</div>
		</div>
		);
}
