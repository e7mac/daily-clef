import React from 'react';

import './Label.css';

export default function Label(props) {
	return (
		<span className="label">
		<a href={"/journal/item/" + props.label}>
		{props.label}</a>
		</span>);
}
