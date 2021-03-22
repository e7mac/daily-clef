import { Collapse, Container, Row, Col, Button } from 'react-bootstrap';
import { faEdit, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import ClipDelete from './ClipDelete';
import ClipEdit from './ClipEdit';
import Tempo from './Tempo';

export default function Clip(props) {
	const [editable, setEditable] = useState(false)
	const [editing, setEditing] = useState(false)

	useEffect(() => {
		if (!props.api.demo) {
			props.api.getUser().then(user => {
				if (user !== null) {
					setEditable(user.id === props.clip.user)
				}
			})
		}
		if (props.clip.label === null) {
			setEditing(true)
		}
	}, [props.api, props.clip.label, props.clip.user])

	const playURL = () => {
		props.onPlay(props.clip)
		// eslint-disable-next-line
		eval("Tone.start()")
	}

	const toggleEditing = () => {
		setEditing(!editing)
	}

	return (
		<div>
			<Container style={props.playingItem === props.clip ? { background: `#dcedc8` } : {}}>
				<Row>
					<Col sm="auto">
						<Button variant="dark" onClick={playURL}><FontAwesomeIcon icon={faPlay} /></Button>
					</Col>
					<Col sm="auto">
						{TimeFormatUtils.formatDuration(props.clip.duration)}
					</Col>
					<Col sm="auto">
						{props.clip.key}
					</Col>
					<Col sm="auto">
						{props.clip.tempo}bpm
					</Col>
					<Col sm="auto">
						{TimeFormatUtils.formatTime(props.clip.date_played)}
					</Col>
					<Col sm="auto">
						LH:{props.clip.left_avg_velocity}
					</Col>
					<Col sm="auto">
						RH:{props.clip.right_avg_velocity}
					</Col>
					{editable &&
						<>
							<Col sm="auto">
								<Button variant="light" onClick={toggleEditing}><FontAwesomeIcon icon={faEdit} /></Button>
							</Col>
							<Col sm="auto">
								<ClipDelete clip={props.clip} api={props.api} />
							</Col>
						</>
					}
					<Col sm="auto">
						<Tempo clip_id={props.clip.id} api={props.api} />
					</Col>
					<Col sm="auto">
						<a href={`https://e7mac.github.io/MIDIano/?url=${props.clip.url}`} target="_blank" rel="noopener noreferrer"><Button variant="link">Synthesia</Button></a>
					</Col>
				</Row>
				<Collapse in={editing}>
					<Row>
						<Col>
							<span className="item"><ClipEdit clip={props.clip} api={props.api} onRelabel={props.onRelabel} /></span>
						</Col>
					</Row>
				</Collapse>
			</Container>
		</div>);
}
