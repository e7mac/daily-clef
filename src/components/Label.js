import React from 'react';

import './Label.css';

export default function Label(props) {

	const labelClicked = () => {
		console.log(props.label)
		props.loadClipsForLabel(props.label)
	}

	return (
		<span className="label" onClick={labelClicked}>
		{props.label}
		</span>);
}
