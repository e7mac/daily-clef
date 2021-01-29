import React from 'react';

import { Card } from 'react-bootstrap';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import './PlayCalendar.css';

export default class PlayCalendar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedDays: []
		}
	}

	handleDayClick = (day) => {
		console.log(day)
	}

	componentDidMount() {
		this.props.api.loadRawSessionFiles()
		.then((rawsessionfiles) => {
			const selectedDays = []
			for (const item of rawsessionfiles) {
				selectedDays.push(new Date(item['date_played']))
			}
			this.setState({
				selectedDays: selectedDays
			})
		})
	}
	render() {
		return (
			<Card>
				<DayPicker
					onDayClick={this.handleDayClick}
					selectedDays={this.state.selectedDays}
				/>
			</Card>
		);
	}
}
