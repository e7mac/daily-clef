import React from 'react';

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
		this.props.api.status().then((response) => {
			const task_count = response.response
			const status = (task_count.classification_tasks > 0 ? " Classifying ":"" )
			+ (task_count.segmentation_tasks > 0 ? " Segmenting ":"" )
			+ (task_count.transcription_tasks > 0 ? " Transcribing ":"" )
			this.setState({
				status: status
			})
		})
	}

	render() {
		return (
				<Navigation className="zIndex">
				<div class="navbar" ref={this.navbarRef}>
					
					<Player ref={this.playerRef} />
					<Recorder api={this.props.api} />
					<div className="status">
					{this.state.status}
					<div className="link" onClick={this.props.handle_logout}>Logout</div>
					</div>
				</div>
				</Navigation>
			);
	}
}
