import React from 'react';
import { Chart } from 'react-charts'
import { Resizable, ResizableBox } from 'react-resizable';
import { Button } from 'react-bootstrap';

import Relabel from './Relabel';
import './Tempo.css';

export default class Tempo extends React.Component {
	constructor(props) {
		super(props);
		this.fn = this.fn.bind(this);
		this.state = {
			success: false,
			clip_id: props.clip_id,
			data: {
				duration: 0,
				tempo_curve: [0]
			}
		}
	}

	fn() {
		const url = `${this.props.api.baseUrl}/api/tempo/${this.state.clip_id}`
		fetch(url)
		.then(res => res.json())
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
					data: result.data,
					tempo_curve: result.data.tempo_curve,
					time: time
				})
			})

	}

	render() {
		let packagedData = []
		const step = this.state.data.duration / this.state.data.tempo_curve.length
		for(let i = 0; i < this.state.data.tempo_curve.length; i++){
			const datum = this.state.data.tempo_curve[i]
			packagedData.push({
				primary: i*step,
				secondary: datum
			})
		}

		const data = [{
			'label': 'tempo',
			data: packagedData
		}]
		const axes = [
       { primary: true, type: 'linear', position: 'bottom' },
       { type: 'linear', position: 'left' },		
		]
		const series = {
      showPoints: false,
    }
		return (
			<span>
			{
				this.state.success 
				?     <ResizableBox width={200} height={200} minConstraints={[100, 100]} maxConstraints={[500, 500]}>
      <Chart data={data} axes={axes} series={series} tooltip />
    </ResizableBox>
					: <Button variant="info" onClick={this.fn}>Tempo</Button>
				}

				</span>);
	}
}
