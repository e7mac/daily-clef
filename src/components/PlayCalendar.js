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
		console.log(month)
		const selectedMonth = month.getTime() / 1000;
		const nextMonth = new Date(month.getTime())
		nextMonth.setMonth(nextMonth.getMonth() + 1)
		this.props.api.loadRawSessionFiles(month.getTime() / 1000, nextMonth.getTime() / 1000)
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
