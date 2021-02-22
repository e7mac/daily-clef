import { Container, Dropdown, Row, Col, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import React from 'react';

import Relabel from './Relabel';

import './ClipEdit.css';

export default class ClipEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sight_reading: props.sight_reading,
			technical: props.technical,
			notes: props.notes
		}
		this.notesTimer = null
		this.stages = [
			'Notes',
			'Rhythm',
			'Articulation',
			'Pedaling',
			'Voicing',
			'Dynamics',
			'Rubato',
			'Tempo'
		]
	}


	editClip = (body) => {
		console.log(body)
		this.props.api.editClip(this.props.clip.id, body)
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

	changeStage = (eventKey, eventObject) => {
		this.editClip({
			learning_stage: eventKey
		})
	}

	onRelabel = () => {
		this.props.onRelabel()

	}

	render() {
		return (
			<Container className="panel-body">
				<Row>
					<Col sm="auto">
						<ButtonGroup toggle className="mb-2">
							<ToggleButton
								type="checkbox"
								variant="info"
								checked={this.state.sight_reading}
								onChange={this.changeSightReading}
							>
								Sight Reading
        				</ToggleButton>
							<ToggleButton
								type="checkbox"
								variant="info"
								checked={this.state.technical}
								onChange={this.changeTechnical}
							>
								Technical
        				</ToggleButton>
						</ButtonGroup>
					</Col>
					<Col sm="auto">
						<Relabel api={this.props.api} clip={this.props.clip} onRelabel={this.onRelabel} />
					</Col>
					<Col sm="auto">
						<Form.Control type="text" placeholder="Add Notes" value={this.state.notes} onChange={this.changeNotes} />
					</Col>
					<Col sm="auto">
						<Dropdown drop='left' onSelect={this.changeStage}>
							<Dropdown.Toggle variant="info" id="dropdown-basic">
								{
									this.props.clip.learning_stage !== null
										? this.stages[this.props.clip.learning_stage]
										: "pick stage"
								}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{
									this.stages.map((item, index) =>
										<Dropdown.Item eventKey={index}>{item}</Dropdown.Item>
									)
								}
							</Dropdown.Menu>
						</Dropdown>
					</Col>
				</Row>
			</Container >
		);
	}
}