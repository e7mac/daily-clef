import React from 'react';

import { Container, Row, Col, Form } from 'react-bootstrap';

import Relabel from './Relabel';

import './ClipEdit.css';

export default class ClipEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: props.id,
			sight_reading: props.sight_reading,
			technical: props.technical,
			notes: props.notes
		}
		this.notesTimer = null
	}


	editClip = (body) => {
		console.log(body)
		this.props.api.editClip(this.state.id, body, this.readCsrfToken())
	}

	changeSightReading = () => {
		this.editClip({
			'sight_reading': !this.state.sight_reading,
		})
		this.setState({ sight_reading: !this.state.sight_reading })
	}

	changeTechnical = () => {
		this.editClip({
			'technical': !this.state.technical,
		})
		this.setState({ technical: !this.state.technical })
	}

	changeNotes = (e) => {
		const notes = e.target.value
		this.setState({
			notes: notes
		})
		if (this.notesTimer !== null) {
			clearTimeout(this.notesTimer);
		}
		this.notesTimer = setTimeout(() => {
			const notes = this.state.notes
			this.editClip({
				'notes': notes
			})
		}, 2000);
	}

	readCsrfToken = () => {
		var name = "csrftoken"
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<input className="button" type="checkbox" checked={this.sight_reading} onChange={this.changeSightReading} />
		Sight Read
		<span className="item"><input className="button" type="checkbox" checked={this.technical} onChange={this.changeTechnical} />
		Technical</span>
					</Col>
					<Col>
						<span className="item"><Relabel api={this.props.api} clip_id={this.state.id} onRelabel={this.props.onRelabel} /></span>
					</Col>
					<Col>
						<Form.Control type="text" placeholder="Notes" value={this.state.notes} onChange={this.changeNotes} />
					</Col>
				</Row>
			</Container >
		);
	}
}