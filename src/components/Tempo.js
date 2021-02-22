import { Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import React from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'

export default class Tempo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false,
			loading: false,
			clip_id: props.clip_id,
			data: {
				duration: 0,
				tempo_curve: [0]
			}
		}
	}

	fn = () => {
		this.setState({ loading: true })
		this.props.api.getTempo(this.state.clip_id)
			.then(
				(result) => {
					const time = []
					const step = result.data.duration / result.data.tempo_curve.length
					for (const i in result.data.tempo_curve) {
						const timeStep = step * i
						time.push(timeStep)
					}
					this.setState({
						success: true,
						loading: false,
						data: result.data,
						tempo_curve: result.data.tempo_curve,
						time: time
					})
				})

	}

	render() {
		let packagedData = []
		const step = this.state.data.duration / this.state.data.tempo_curve.length
		for (let i = 0; i < this.state.data.tempo_curve.length; i++) {
			const datum = this.state.data.tempo_curve[i]
			packagedData.push({
				time: TimeFormatUtils.formatDuration(Math.floor(i * step)),
				tempo: Math.floor(datum)
			})
		}
		return (
			<>
				{
					this.state.success
						? <LineChart
							width={300}
							height={300}
							data={packagedData}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="time" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="tempo" stroke="#82ca9d" dot={false} unit="bpm" />
						</LineChart>
						: <Button variant="light" disabled={this.state.loading} onClick={this.fn}>
							{this.state.loading ? 'Loading…' : 'Tempo'}
						</Button>
				}
			</>);
	}
}
