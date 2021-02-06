import { Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';

export default class Settings extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Modal.Dialog>
				<Modal.Header closeButton>
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p>Modal body text goes here.</p>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary">Close</Button>
					<Button variant="primary">Save changes</Button>
				</Modal.Footer>
			</Modal.Dialog>);
	}
}