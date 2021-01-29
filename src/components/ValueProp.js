import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap';

import Tempo from './Tempo';
import ClipEdit from './ClipEdit';
import * as TimeFormatUtils from '../utils/TimeFormatUtils'

import './Clip.css';

export default function Clip(props) {
	const [edit, setEdit] = useState(false)

	useEffect(()=>{
		if (!props.api.demo) {
			props.api.getUser().then(user => {
				if (user!==null) {
					setEdit(user.id === props.clip.user)
				}
			})			
		}
	})


	const playURL = () => {
		props.onPlay(props.clip)
	}

	return (
		<div>
		<Container>
			<Row>
				<Col sm="auto">
				<span className="btn"><img alt="play" onClick={playURL} src="https://static.vecteezy.com/system/resources/thumbnails/000/630/395/small/illust58-7477-01.jpg" width="30px" height="30px" /></span>
				</Col>
				<Col sm="auto">
				<span className="item">{TimeFormatUtils.formatDuration(props.clip.duration)}</span>
				</Col>
				<Col sm="auto">		
				<span className="item">{props.clip.key}</span>
				</Col>
				<Col sm="auto">
				<span className="item">{props.clip.tempo}bpm </span>
				</Col>
				<Col sm="auto">
				<span className="item">{TimeFormatUtils.formatTime(props.clip.date_played)}</span>
				</Col>
				<Col sm="auto">
				<span className="item"><Tempo clip_id={props.clip.id} api={props.api} /></span>
				</Col>
				<Col sm="auto">
				<a href={`https://e7mac.github.io/MIDIano/?url=${props.clip.url}`} target="_blank" rel="noopener noreferrer"><Button variant="info">Synthesia</Button></a>
				</Col>
			</Row>
			<Row>
				<Col>
				{edit && 
					<span className="item"><ClipEdit id={props.clip.id} api={props.api} sight_reading={props.clip.sight_reading} technical={props.clip.technical} onRelabel={props.onRelabel} notes={props.clip.notes} /></span>
				}
				</Col>
			</Row>
		</Container>
		</div>);
	}
