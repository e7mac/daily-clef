import { ListGroup } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import React from 'react';

import { formatDuration } from '../utils/TimeFormatUtils'
import Clip from './Clip';

import './ClipGroup.css';

export default function ClipGroup(props) {

	let duration = 0
	props.group.clips.forEach((clip) => {
		duration = duration + clip.duration
	})

	return (
		<div>
			<Collapsible trigger={`${props.group.name} (${formatDuration(duration)})`} >
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
