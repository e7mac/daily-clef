import { Collapse, Button, ListGroup } from 'react-bootstrap';
import { React, useState } from 'react';

import { formatDuration } from '../utils/TimeFormatUtils'
import Clip from './Clip';

import './ClipGroup.css';

export default function ClipGroup(props) {
	const [open, setOpen] = useState(false);

	let duration = 0
	props.group.clips.forEach((clip) => {
		duration = duration + clip.duration
	})

	return (
		<div>
			<div onClick={() => setOpen(!open)} className="clip-group-name-label">
				{`${props.group.name} (${formatDuration(duration)})`}
			</div>
			<Collapse in={open}>
				<ListGroup>
					{
						props.group.clips.map((clip, index) => {
							return (
								<ListGroup.Item><Clip api={props.api} key={clip.id} clip={clip} onRelabel={props.onRelabel} onPlay={props.onPlay} /></ListGroup.Item>
							)
						})
					}
				</ListGroup>
			</Collapse>

		</div>);
}
