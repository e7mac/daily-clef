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

	onDayClick = (day) => {
		console.log(day)
	}

	monthChange = (month) => {
		console.log(month)
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
					onDayClick={this.onDayClick}
					selectedDays={this.state.selectedDays}
					onMonthChange={this.monthChange}
				/>
			</Card>
		);
	}
}
