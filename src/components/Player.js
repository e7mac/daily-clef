import React, { useState, useEffect, useRef } from 'react';

import './Player.css';

export default function Player(props) {
	const midiPlayerRef = useRef(null)

	let status = ""

	useEffect(() => {
  		const m = midiPlayerRef.current
  		if (m!==null) {
		m.addEventListener('load', () => {
			if (m.playing===false) {
				m.start();
			}
		})  			
  		}
  	}, [])

	const getLabel = (item) => {
		if (item.label !== null) {
			return item.label.name
		} else if (item.sight_reading===true) {
			return "Sight Reading"
		} else if (item.technical===true) {
			return "Technical"
		}
		return ""
	}

	if (props.playingItem !== null) {
		const m = midiPlayerRef.current
		m.src = props.playingItem.url
		console.log(getLabel(props.playingItem))
		status = getLabel(props.playingItem)
	}

	return (
		<span>
			<span>
				<midi-player id="midi-player" sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus" ref={midiPlayerRef} />
				<span className="status">{status}</span>
			</span>
		</span>
		);
}
