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

	loadClipsForLabel = (e) => {
		const label = e.target.id.split('label-bar-')[1]
		this.props.loadClipsForLabel(label)
	}

	render() {
		return (
			<NavDropdown title="Pieces" id="basic-nav-dropdown">
				<NavDropdown.Item onClick={this.props.loadAllClips}>All</NavDropdown.Item>
				<NavDropdown.Divider />
				{
					this.state.labels.length > 0
						? this.state.labels.map((label, index) => {
							return (
								<NavDropdown.Item onClick={this.loadClipsForLabel} id={`label-bar-${label.name}`}>
									{ label.name}
								</NavDropdown.Item>
							)
						})
						: <NavDropdown.Item>As you label pieces, they will appear here</NavDropdown.Item>

				}
			</NavDropdown >
		);
	}
}
