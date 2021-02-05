import { NavDropdown } from 'react-bootstrap';
import React from 'react';

import './LabelBar.css';

export default class LabelBar extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			labels: []
		}

		this.props.api.loadLabels().then((labels) => {
			this.setState({
				labels: labels
			})
		})
	}

	setHash(e) {
		console.log(e)
		const label = e.target.id.split('label-id-')[1]
		window.location.hash = `#/label/${label}`
	}

	render() {
		return (
			<NavDropdown title="Pieces" id="basic-nav-dropdown">
				<NavDropdown.Item href="/daily-clef">All</NavDropdown.Item>
				<NavDropdown.Divider />
				{
					this.state.labels.length > 0
						? this.state.labels.map((label, index) => {
							return (
								<NavDropdown.Item onClick={this.setHash} id={`label-id-${label.name}`} >
									{label.name}
								</NavDropdown.Item>
							)
						})
						: <NavDropdown.Item>As you label pieces, they will appear here</NavDropdown.Item>

				}
			</NavDropdown >
		);
	}
}
