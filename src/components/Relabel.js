import React, { useState, useRef } from 'react';

import { Button } from 'react-bootstrap';

import './Relabel.css';

export default function Relabel(props) {

	const [success, setSuccess] = useState(false)

	const labelRef = useRef(null)

	const relabelItem = () => {
		const label = labelRef.current.value
		props.onRelabel(props.clip_id, label)
		props.api.relabelItem(props.clip_id, label)
			.then((response) => {
				setSuccess(true)
				console.log(response)
			})
	}

	return (
		<span id={`div-relabel-${props.clip_id}`}>
			{
				success
					? " Done! Refresh to see results"
					: <span>
						<input type="text" ref={labelRef} />
						<Button variant="info" onClick={relabelItem}>Relabel</Button>
					</span>
			}
		</span>
	);
}
