import React from 'react';

import { NavDropdown } from 'react-bootstrap';

import './LabelBar.css';
import Label from './Label';

export default class LabelBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			labels: []
		}

	}
	
	componentDidMount() {
		this.props.api.loadLabels().then((labels) => {
			this.setState({
				labels: labels
			})
		})
	}

	render() {
		return (
		<NavDropdown title="Pieces" id="basic-nav-dropdown">
			{this.state.labels.map((label, index) => {
				return (
				<NavDropdown.Item>
					<Label label={label.name} key={label.name} loadClipsForLabel={this.props.loadClipsForLabel} />
				</NavDropdown.Item>
				)
			})
			}
		</NavDropdown>
		);
	}
}
