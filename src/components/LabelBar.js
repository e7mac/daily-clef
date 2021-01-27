import React, { useState, useEffect } from 'react';

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
		<div className="card">
		{
			labels.map((label, index) => {
				return (
				<Label label={label.name} key={label.name} loadClipsForLabel={props.loadClipsForLabel} />
				)
			})
		}
		</div>
		);
}
