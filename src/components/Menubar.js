import { Alert, Navbar, Nav } from 'react-bootstrap';
import { faChartBar, faMicrophone, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import React, { Component } from 'react';

import LabelBar from './LabelBar'
import Settings from './Settings'
import Upload from './Upload'

import logo from '../logo.svg'

export default class Menubar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logged_in: localStorage.getItem('access_token') ? true : false,
			username: '',
			status: "",
		};
		this.timer = null
	}

	componentDidMount() {
		if (this.state.logged_in && !this.props.api.demo) {
			this.startTimer()
		}
	}

	startTimer = () => {
		this.timer = setInterval(this.refreshStatus, 3000);
	}

	endTimer = () => {
		clearInterval(this.timer);
		this.timer = null;
	}

	componentWillUnmount() {
		this.endTimer()
	}

	refreshStatus = () => {
		this.props.api.getStatus().then((response) => {
			console.log(response)
			const task_count = response.response
			const status =
				(task_count.conversion_tasks > 0 ? " Converting " : "")
				+ (task_count.transcription_tasks > 0 ? " Transcribing " : "")
				+ (task_count.segmentation_tasks > 0 ? " Segmenting " : "")
				+ (task_count.classification_tasks > 0 ? " Classifying " : "")
			if (status.length > 0) {
				this.setState({
					status: status
				})
			}
		})
	}

	handle_logout = () => {
		this.endTimer()
		this.props.api.handle_logout()
		this.setState({ logged_in: false, username: '' });
		window.location.reload()
	};

	setStatus = (status) => {
		this.setState({
			status: status
		})
	}

	render() {
		return (
			<Navbar bg="dark" variant="dark" expand="sm" className="panel-body">
				<Link to="/"><Navbar.Brand className="brand"><img src={logo} className="logo" alt="logo" />Daily Clef</Navbar.Brand></Link>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{this.state.logged_in || this.props.api.demo
						? <React.Fragment>
							<Nav className="mr-auto">
								{
									this.state.logged_in
										? <React.Fragment>
											<Upload api={this.props.api} setStatus={this.setStatus} />
											<Nav.Link href="#record"><FontAwesomeIcon icon={faMicrophone} /></Nav.Link>
										</React.Fragment>
										: ""
								}
								<LabelBar api={this.props.api} loadAllClips={this.loadAllClips} loadClipsForLabel={this.loadClipsForLabel} />
								<Nav.Link href="#stats"><FontAwesomeIcon icon={faChartBar} /></Nav.Link>
								<Settings api={this.props.api} />
								{
									this.state.status.length > 0
										? <Alert key={0} variant='secondary'>
											{this.state.status}
										</Alert>
										: <br />
								}
							</Nav>
							<Nav.Link href="https://docs.google.com/presentation/d/1O5Cn5bAdaDnauJvbXcvuSl-KqBAbwfuPzD1cqoklacA/edit?usp=sharing" target="_blank">Help</Nav.Link>
							{
								this.state.logged_in
									? <Nav.Link onClick={this.handle_logout}><FontAwesomeIcon icon={faSignOutAlt} /></Nav.Link>
									: <Nav.Link href="/"><FontAwesomeIcon icon={faSignInAlt} /></Nav.Link>
							}
						</React.Fragment>
						: ""
					}
				</Navbar.Collapse>
			</Navbar >
		);
	}
}
