import React, { useState, useRef, useEffect } from 'react';

import { Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import './Relabel.css';

export default function Relabel(props) {

	const [success, setSuccess] = useState(false)
	const [options, setOptions] = useState([])

	const labelRef = useRef(null)

	const relabelItem = () => {
		const label = labelRef.current.getInput().value
		props.onRelabel(props.clip_id, label)
		props.api.relabelItem(props.clip_id, label)
			.then((response) => {
				setSuccess(true)
				console.log(response)
			})
	}

	useEffect(() => {
		props.api.loadLabels().then((labels) => {
			setOptions(labels)
		})
	}, [props.api]);

	return (
		<span id={`div-relabel-${props.clip_id}`}>
			{
				success
					? " Done! Refresh to see results"
					: <span>
						<Typeahead ref={labelRef}
							id="relabel"
							labelKey="name"
							options={options}
						/>
						<Button variant="info" onClick={relabelItem}>Relabel</Button>
					</span>
			}
		</span>
	);
}
