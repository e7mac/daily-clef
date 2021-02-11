import React from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import ClipGroup from './ClipGroup';

import './ClipGroupSet.css';

export default function ClipGroupSet(props) {

	let duration = 0
	props.set.groups.forEach((groups) => {
		groups.clips.forEach((clip) => {
			duration = duration + clip.duration
		})
	})

	return (
		<div>
			<h5>{`${props.set.title} (${TimeFormatUtils.formatDuration(duration)})`}</h5>
			{
				props.set.groups.map((group, index) => {
					return (
						<ClipGroup api={props.api} key={group.name} group={group} onRelabel={props.onRelabel} onPlay={props.onPlay} playingItem={props.playingItem} />
					)
				})
			}
		</div>
	);
}
