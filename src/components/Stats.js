import React from 'react';

import * as TimeFormatUtils from '../utils/TimeFormatUtils'
import './Stats.css';

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

	render() {
		return (
			<React.Fragment>
				{this.state.stats
					? <React.Fragment>
						<p>{`Total time practiced: ${TimeFormatUtils.formatDuration(this.state.stats.duration)}`}</p>
						{this.state.stats.labels.map((label) => {
							return <p>{label.label}: {TimeFormatUtils.formatDuration(label.duration)}</p>
						})
						}
					</React.Fragment>
					: "Loading..."
				}
			</React.Fragment>
		);
	}
}