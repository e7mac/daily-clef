import React from 'react';

import { Alert } from 'react-bootstrap';

import { Row, Col } from 'react-bootstrap';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Player from './Player'
import Recorder from './Recorder'
import Navigation from "react-sticky-nav";
import './NavigationBar.css';

export default class NavigationBar extends React.Component {
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
			<Navbar bg="light" expand="lg">
			<Navbar.Brand href="/">Daily Clef</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
			<Nav.Link onClick={this.handle_logout}>Logout</Nav.Link>
			</Nav>
			</Navbar.Collapse>
			</Navbar>      
			);
	}
}
