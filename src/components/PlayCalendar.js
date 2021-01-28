import React, { useState, useEffect } from 'react';

import { Card } from 'react-bootstrap';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import './PlayCalendar.css';

export default function PlayCalendar(props) {

	const [selectedDays, setSelectedDays] = useState([])

	const handleDayClick = (day) => {
		console.log(day)
	}

	useEffect(() => {
		loadCalendar()
  	}, []) // notice the empty array

	const loadCalendar = () => {
		props.api.loadRawSessionFiles()
		.then((rawsessionfiles) => {
			const selectedDays_ = []
			for (const item of rawsessionfiles) {
				selectedDays_.push(new Date(item['date_played']))
			}
			setSelectedDays(selectedDays_)
		})
	}

	return (
		<Card>
			<DayPicker
				onDayClick={handleDayClick}
				selectedDays={selectedDays}
			/>
		</Card>
	);
}
