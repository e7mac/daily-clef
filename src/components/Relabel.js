import { Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';

import './Relabel.css';

export default class Relabel extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			success: false,
			options: []
		}
		this.labelRef = React.createRef()
		this.relabelTimer = null
	}

	relabelItem = () => {
		const label = this.labelRef.current.getInput().value
		console.log(label)
		if (this.relabelTimer !== null) {
			clearTimeout(this.relabelTimer);
		}
		// this.relabelTimer = setTimeout(() => {
		this.props.api.relabelItem(this.props.clip.id, label)
			.then((response) => {
				this.setState({ success: true })
				// this.props.onRelabel(this.props.clip.id, label)
			})
		// }, 2000);
	}

	componentDidMount() {
		this.props.api.loadLabels().then((labels) => {
			this.setState({ options: labels })
		})
	}

	render() {
		const oldLabel = this.props.clip.label ? this.props.clip.label.name : ""
		return (
			<span id={`div-relabel-${this.props.clip.id}`}>
				{
					this.state.success
						? " Done! Refresh to see results"
						: <span>
							<Typeahead ref={this.labelRef}
								placeholder="Add Label"
								defaultInputValue={oldLabel}
								id="relabel"
								labelKey="name"
								options={this.state.options}
							/>
							<Button variant="info" onClick={this.relabelItem}>Relabel</Button>
						</span>
				}
			</span >
		);
	}
}