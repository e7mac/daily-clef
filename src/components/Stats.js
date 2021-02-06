import React from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import './Stats.css';

import { XAxis, YAxis, Legend, CartesianGrid, BarChart, Bar, PieChart, Pie, Tooltip } from 'recharts';

export default class Stats extends React.Component {
	constructor(props) {
		super(props)
		this.state = { stats: null }
	}

	componentDidMount() {
		this.props.api.stats().then((res) => {
			console.log(res)
			this.setState({
				stats: res.response
			})
		})
	}

	format(value, name, props) {
		return TimeFormatUtils.formatDuration(value)
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
						<p>{`Total time practiced: ${TimeFormatUtils.formatDuration(this.state.stats.duration)}`}</p>
						<BarChart width={1200} height={400} data={data} barCategoryGap={1} barSize={30} >
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis tickFormatter={this.format} />
							<Legend />
							<Tooltip formatter={this.format} />
							<Bar dataKey="value" fill="#8884d8" />
						</BarChart>
						<PieChart width={400} height={400}>
							<Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={200} />
							<Tooltip formatter={this.format} />
						</PieChart>
					</React.Fragment>
					: "Loading..."
				}
			</React.Fragment>
		);
	}
}