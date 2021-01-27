import React, { useState } from 'react';
import Collapsible from 'react-collapsible';

import Clip from './Clip';

import './ClipGroup.css';

export default function ClipGroup(props) {

	const [name, setName] = useState(props.group.name)
	const [clips, setClips] = useState(props.group.clips)
	const [edit, setEdit] = useState(props.edit)

	const displayDuration = (time) => {
		const min =  Math.floor(time / 60);
		const sec = time % 60;
		let sec_min = (min < 10 ? "0" : "");
		sec_min = sec_min + min + ":" + (sec < 10 ? "0" : "");
		sec_min = sec_min + sec;
		return sec_min;
	}

	let duration = 0
	clips.map((clip) => {
		duration = duration + clip.duration
	})

	return (
		<div>
		<Collapsible trigger={name + " (" + displayDuration(duration) + ")" }>
		<div>
		{
			clips.map((clip, index) => {
				return (
					<Clip api={props.api} key={clip.id} clip={clip} edit={edit} onRelabel={props.onRelabel} onPlay={props.onPlay} />
					)
			})
		}
		</div>
		</Collapsible>
		</div>);
}
