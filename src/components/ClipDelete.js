import { Button } from 'react-bootstrap';
import React from 'react';

import './ClipDelete.css';

export default class ClipDelete extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmation: false,
			deleted: false
		}
	}

	deleteClip = () => {
		this.props.api.deleteClip(this.props.clip.id).then(() => {
			this.setState({ deleted: true })
		})
	}

	render() {
		return (
			<React.Fragment>
				{
					this.state.deleted
						? "Deleted. Refresh as needed"
						: this.state.confirmation
							? <Button variant="danger" onClick={this.deleteClip}>Sure?</Button>
							: <Button variant="info" onClick={() => { this.setState({ confirmation: true }) }}>Delete</Button>
				}
			</React.Fragment>
		);
	}
}