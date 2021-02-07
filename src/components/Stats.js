import { Card, Dropdown } from 'react-bootstrap';
import { XAxis, YAxis, Legend, CartesianGrid, BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import prettyDate from 'pretty-date-js';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'

export default class Stats extends React.Component {
	constructor(props) {
		super(props)
		this.state = { stats: null }
	}

	componentDidMount() {
		this.props.api.stats().then((res) => {
			console.log(res)
			this.setState({
				data: res.response,
				key: 'all',
				stats: res.response.all
			})
		})
	}

	format(value, name, props) {
		return TimeFormatUtils.formatDuration(value)
	}

	changeTimeframe = (eventKey, eventObject) => {
		const data = this.state.data
		this.setState({
			key: eventKey,
			stats: data[eventKey]
		})
	}

	datePrettify = (date) => {
		const obj = prettyDate(date)
		return `${obj.value} ${obj.lang} ${obj.misc}`
	}

	render() {
		let data = []
		let last_played = []

		if (this.state.stats) {
			for (const item of this.state.stats.labels) {
				data.push({
					name: item.label,
					value: item.duration
				})
			}
			last_played = this.state.data.last_played
		}
		data.sort((a, b) => b.value - a.value)
		last_played.sort((a, b) => b.date > a.date)
		console.log(last_played)
		return (
			<React.Fragment>
				{this.state.stats
					? <React.Fragment>
						<Card>
							<p>{`Total time practiced: ${TimeFormatUtils.formatDuration(this.state.data.all.duration)}`}</p>
							<p>{`Last 24h: ${TimeFormatUtils.formatDuration(this.state.data.day.duration)}`}</p>
							<p>{`Last week: ${TimeFormatUtils.formatDuration(this.state.data.week.duration)}`}</p>
							<p>{`Last month: ${TimeFormatUtils.formatDuration(this.state.data.month.duration)}`}</p>
						</Card>
						<Card>
							<Dropdown onSelect={this.changeTimeframe}>
								<Dropdown.Toggle variant="info" id="dropdown-basic">
									{this.state.key}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item eventKey="all">All</Dropdown.Item>
									<Dropdown.Item eventKey="day">Last 24h</Dropdown.Item>
									<Dropdown.Item eventKey="week">Last week</Dropdown.Item>
									<Dropdown.Item eventKey="month">Last month</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<ResponsiveContainer height={400}>
								<BarChart data={data} barCategoryGap={1} barSize={30} >
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis tickFormatter={this.format} />
									<Legend />
									<Tooltip formatter={this.format} />
									<Bar dataKey="value" fill="#8884d8" />
								</BarChart>
							</ResponsiveContainer>
						</Card>
						<Card>
							{
								last_played.map((item, index) => {
									return (
										<p>{item.name} - {this.datePrettify(item.date)}</p>
									)
								})
							}
						</Card>
					</React.Fragment>
					: "Loading..."
				}
			</React.Fragment>
		);
	}
}