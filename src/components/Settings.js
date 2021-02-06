import { Button, Modal, Form } from 'react-bootstrap';
import React from 'react';

export default class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false,
			loading: true,
			threshold: null,
			min_length: null
		}
	}

	handleClose = () => this.setState({ show: false });
	handleShow = () => {
		this.setState({ show: true });
		this.props.api.getSettings().then(res => {
			this.setState({
				loading: false,
				threshold: res.threshold,
				min_length: res.min_length
			})
			console.log(res)
		})
	}

	save = () => {
		console.log(this.state)
		this.props.api.setSettings({
			threshold: this.state.threshold,
			min_length: this.state.min_length
		}).then(res => {
			console.log(res)
			this.handleClose()
		})
	}

	render() {
		return (
			<>
				<Button variant="secondary" onClick={this.handleShow}>
					⚙️
		  		</Button>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{
							this.state.loading
								? "Loading..."
								: <>
									<Form.Group controlId="threshold">
										<Form.Label>Threshold</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter threshold"
											value={this.state.threshold}
											onChange={e => this.setState({ threshold: e.target.value })}
										/>
										<Form.Text className="text-muted">
											How many seconds of silence before creating a new clip
    									</Form.Text>
									</Form.Group>
									<Form.Group controlId="Min Length">
										<Form.Label>Min Length</Form.Label>
										<Form.Control type="text" placeholder="Enter minimum length" value={this.state.min_length}
											onChange={e => this.setState({ min_length: e.target.value })} />
										<Form.Text className="text-muted">
											How many seconds of sound that qualifies as a clip
    									</Form.Text>
									</Form.Group>
								</>
						}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
				  </Button>
						<Button variant="primary" onClick={this.save}>
							Save
				  </Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}