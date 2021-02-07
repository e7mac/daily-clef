import { Card, Dropdown } from 'react-bootstrap';
import { XAxis, YAxis, Legend, CartesianGrid, BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';

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

	changeTimeframe = (e) => {
		const key = e.target.id
		const data = this.state.data
		this.setState({
			key: key,
			stats: data[key]
		})
	}

	render() {
		let data = []
		if (this.state.stats) {
			for (const item of this.state.stats.labels) {
				data.push({
					name: item.label,
					value: item.duration
				})
			}
		}
		data.sort((a, b) => b.value - a.value)
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
							<Dropdown>
								<Dropdown.Toggle variant="info" id="dropdown-basic">
									{this.state.key}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={this.changeTimeframe} id="all">All</Dropdown.Item>
									<Dropdown.Item onClick={this.changeTimeframe} id="day">Last 24h</Dropdown.Item>
									<Dropdown.Item onClick={this.changeTimeframe} id="week">Last week</Dropdown.Item>
									<Dropdown.Item onClick={this.changeTimeframe} id="month">Last month</Dropdown.Item>
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
					</React.Fragment>
					: "Loading..."
				}
			</React.Fragment>
		);
	}
}