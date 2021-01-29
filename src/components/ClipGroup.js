import React, { useState } from 'react';
import Collapsible from 'react-collapsible';

import { ListGroup } from 'react-bootstrap';

import Clip from './Clip';

import './ClipGroup.css';

export default function ClipGroup(props) {
	const displayDuration = (time) => {
		const min =  Math.floor(time / 60);
		const sec = time % 60;
		let sec_min = (min < 10 ? "0" : "");
		sec_min = sec_min + min + ":" + (sec < 10 ? "0" : "");
		sec_min = sec_min + sec;
		return sec_min;
	}

	let duration = 0
	props.group.clips.forEach((clip) => {
		duration = duration + clip.duration
	})

	return (
		<div>
		<Collapsible trigger={`${props.group.name} (${displayDuration(duration)})`} >
		<ListGroup>
		{
			props.group.clips.map((clip, index) => {
			return (
				<ListGroup.Item><Clip api={props.api} key={clip.id} clip={clip} onRelabel={props.onRelabel} onPlay={props.onPlay} /></ListGroup.Item>
			)
			})
		}
		</ListGroup>
		</Collapsible>
		</div>);
}
