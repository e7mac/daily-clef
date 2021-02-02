import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import ClipEdit from './ClipEdit';
import Tempo from './Tempo';

import './Clip.css';

export default function Clip(props) {
	const [edit, setEdit] = useState(false)

	useEffect(() => {
		if (!props.api.demo) {
			props.api.getUser().then(user => {
				if (user !== null) {
					setEdit(user.id === props.clip.user)
				}
			})
		}
	})

	const playURL = () => {
		props.onPlay(props.clip)
		// eslint-disable-next-line
		eval("Tone.start()")
	}

	return (
		<div>
			<Container>
				<Row>
					<Col sm="auto">
						<span className="btn"><img alt="play" onClick={playURL} src="https://static.vecteezy.com/system/resources/thumbnails/000/630/395/small/illust58-7477-01.jpg" width="30px" height="30px" /></span>
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
						<Tempo clip_id={props.clip.id} api={props.api} />
					</Col>
					<Col sm="auto">
						<a href={`https://e7mac.github.io/MIDIano/?url=${props.clip.url}`} target="_blank" rel="noopener noreferrer"><Button variant="info">Synthesia</Button></a>
					</Col>
				</Row>
				<Row>
					<Col>
						{edit &&
							<span className="item"><ClipEdit clip={props.clip} api={props.api} sight_reading={props.clip.sight_reading} technical={props.clip.technical} onRelabel={props.onRelabel} notes={props.clip.notes} /></span>
						}
					</Col>
				</Row>
			</Container>
		</div>);
}
