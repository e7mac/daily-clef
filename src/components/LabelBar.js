import React, { useState, useEffect } from 'react';

import { NavDropdown } from 'react-bootstrap';

import './LabelBar.css';
import Label from './Label';

export default function LabelBar(props) {
	const [labels, setLabels] = useState([])

	useEffect(()=>{
		props.api.loadLabels().then((labels) => {
			setLabels(labels)
		})
	},[])

	return (
		<NavDropdown title="Pieces" id="basic-nav-dropdown">
			{labels.map((label, index) => {
				return (
				<NavDropdown.Item>
				<Label label={label.name} key={label.name} loadClipsForLabel={props.loadClipsForLabel} />
				</NavDropdown.Item>
				)
			})
			}
		</NavDropdown>
		);
}
