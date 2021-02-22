import { Button } from 'react-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';

import './ClipDelete.css';

export default class ClipDelete extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmation: false,
			deleted: false
		}
		this.deleteButton = React.createRef();
	}

	deleteClip = () => {
		if (this.state.confirmation) {
			this.props.api.deleteClip(this.props.clip.id).then(() => {
				this.setState({ deleted: true })
			})
		} else {
			this.setState({ confirmation: true })
			setTimeout(() => {
				document.addEventListener('click', this.handleOutsideClick);
			}, 100)
		}
	}

	handleOutsideClick = (event) => {
		if (this.deleteButton.current !== null) {
			if (!this.deleteButton.current.contains(event.target)) {
				this.setState({ confirmation: false })
				document.removeEventListener('click', this.handleOutsideClick);
			}
		}
	}

	render() {
		return (
			<React.Fragment>
				{
					this.state.deleted
						? "Deleted. Refresh as needed"
						: this.state.confirmation
							? <Button variant="danger" onClick={this.deleteClip} ref={this.deleteButton}>Sure?</Button>
							: <Button variant="light" onClick={this.deleteClip} ref={this.deleteButton}><FontAwesomeIcon icon={faTrash} /></Button>
				}
			</React.Fragment>
		);
	}
}