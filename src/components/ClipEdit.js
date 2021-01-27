import React, { useState, useEffect, useRef } from 'react';

import Relabel from './Relabel';

import './ClipEdit.css';

export default function ClipEdit(props) {

	const [id, setId] = useState(props.id)
	const [sight_reading, setSight_reading] = useState(props.sight_reading)
	const [technical, setTechnical] = useState(props.technical)
	const [notes, setNotes] = useState(props.notes)

	const notesRef = useRef(null)

	let notesTimer = null

	const editClip = (body) => {
		props.api.editClip(id, body, readCsrfToken())
	}

	const changeSightReading = () => {
		editClip({
			'sight_reading': !sight_reading,
		})
		setSight_reading(!sight_reading)
	}

	const changeTechnical = () => {
		editClip({
			'technical': !technical,
		})
		setTechnical(!technical)
	}

	const changeNotes = (e) => {
		const notes = e.target.value
		setNotes(notes)
		if (notesTimer!==null) {
			clearTimeout(notesTimer);
		}
		notesTimer = setTimeout( () => {
			const notes = notesRef.current.value
			editClip({
				'notes': notes
			})
		}, 
		2000);
	}

	const readCsrfToken = () => {
		var name = "csrftoken"
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	return (
		<div>
		<p>
		<input className="button" type="checkbox" checked={sight_reading} onChange={changeSightReading} />
		Sight Read
		<span className="item"><input className="button" type="checkbox" checked={technical} onChange={changeTechnical} />
		Technical</span>
		<span className="item"><Relabel api={props.api} clip_id={id} onRelabel={props.onRelabel} /></span>
		</p>
		<p>Notes:<input ref={notesRef} type="text" value={notes} onChange={changeNotes} />
		</p>
		</div>
		);
}
