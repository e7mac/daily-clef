import { Button, Modal } from 'react-bootstrap';
import React from 'react';

export default class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false
		}
	}

	handleClose = () => this.setState({ show: false });
	handleShow = () => {
		this.setState({ show: true });
		this.props.api.getSettings().then(res => {
			console.log(res)
		})
	}

	render() {
		return (
			<>
				<Button variant="secondary" onClick={this.handleShow}>
					Settings
		  		</Button>
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>Settings will go here</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
				  </Button>
						<Button variant="primary" onClick={this.handleClose}>
							Save
				  </Button>
					</Modal.Footer>
				</Modal>
			</>
		)
	}
}