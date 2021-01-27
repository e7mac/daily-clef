import React, { useState, useEffect, useRef } from 'react';

import Player from './Player'
import Recorder from './Recorder'
import Navigation from "react-sticky-nav";
import './Navbar.css';

export default function Navbar(props) {

	const [status, setStatus] = useState("")

	let timer = null

	useEffect(() => {
  		timer = setInterval(refreshStatus, 3000);
  
  		return () => {
    		clearInterval(timer);
			timer = null;
  		}
	}, []) // notice the empty array

	const refreshStatus = () => {
		props.api.status().then((response) => {
			const task_count = response.response
			const status = (task_count.classification_tasks > 0 ? " Classifying ":"" )
			+ (task_count.segmentation_tasks > 0 ? " Segmenting ":"" )
			+ (task_count.transcription_tasks > 0 ? " Transcribing ":"" )
			setStatus(status)
		})
	}

	return (
			<Navigation className="zIndex">
			<div className="navbar" >
				<Player playingItem={props.playingItem} />
				<Recorder api={props.api} />
				<div className="status">
				{status}
				</div>
			</div>
			</Navigation>
		);
}
