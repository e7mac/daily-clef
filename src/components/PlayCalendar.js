import { Card } from 'react-bootstrap';
import DayPicker from 'react-day-picker';
import React from 'react';

import 'react-day-picker/lib/style.css';

export default class PlayCalendar extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedDays: [],
			initialMonth: new Date()
		}
	}

	onDayClick = (day) => {
		console.log(day)
	}

	monthChange = (month) => {
		const nextMonth = new Date(month.getTime())
		nextMonth.setMonth(nextMonth.getMonth() + 1)
		const startTime = month.getTime() / 1000
		const endTime = nextMonth.getTime() / 1000
		this.props.onMonthChanged(startTime, endTime)
		this.props.api.loadRawSessionFiles(startTime, endTime)
			.then((rawsessionfiles) => {
				const selectedDays = []
				for (const item of rawsessionfiles) {
					selectedDays.push(new Date(item['date_played']))
				}
				this.setState({
					selectedDays: selectedDays,
					initialMonth: month
				})
			})

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
					initialMonth={this.state.initialMonth}
				/>
			</Card>
		);
	}
}
