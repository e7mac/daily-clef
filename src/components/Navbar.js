import React from 'react';

import { Alert } from 'react-bootstrap';

import Player from './Player'
import Recorder from './Recorder'
import Navigation from "react-sticky-nav";
import './Navbar.css';

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: ""
		}
		this.refreshStatus = this.refreshStatus.bind(this);		
		this.timer = null
	}

	componentDidMount() {
		this.timer = setInterval(this.refreshStatus, 3000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
		this.timer = null;
	}

	refreshStatus() {
		this.props.api.getStatus().then((response) => {
			console.log(response)
			const task_count = response.response
			const status = 
			(task_count.conversion_tasks > 0 ? " Converting ":"" )
			+ (task_count.transcription_tasks > 0 ? " Transcribing ":"" )
			+ (task_count.segmentation_tasks > 0 ? " Segmenting ":"" )
			+ (task_count.classification_tasks > 0 ? " Classifying ":"" )
			this.setState({
				status: status
			})
		})
	}

	render() {
		return (
				<Navigation className="zIndex">
				<div className="navbar" ref={this.navbarRef}>
					<Player playingItem={this.props.playingItem} />
					<Recorder api={this.props.api} />
					{
						this.state.status.length > 0
						? <Alert key={0} variant='secondary'>
							{this.state.status}
						  </Alert>
						: <br/>
					}
				</div>
				</Navigation>
			);
	}
}
