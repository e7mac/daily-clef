import React from 'react';

import NoSleep from '../lib/nosleep'

export default class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			status: "",
			noSleep: new NoSleep()
		}
		this.midiPlayerRef = React.createRef()
		this.midiPlayerAutoplayOnSourceChange = this.midiPlayerAutoplayOnSourceChange.bind(this);
	}

	midiPlayerAutoplayOnSourceChange() {
		const m = this.midiPlayerRef.current
		m.addEventListener('load', () => {
			if (m.playing === false) {
				m.start();
			}
			this.setState((prevState, props) => ({
				status: this.getLabel(this.props.playingItem)
			}));
		})
		m.addEventListener('start', () => {
			this.state.noSleep.enable()
		})
		m.addEventListener('stop', () => {
			this.state.noSleep.disable()
		})

	}

	componentDidMount() {
		this.midiPlayerAutoplayOnSourceChange()

	}

	componentDidUpdate() {
		const m = this.midiPlayerRef.current
		if (this.props.playingItem !== null && m.src !== this.props.playingItem.url) {
			const m = this.midiPlayerRef.current
			m.src = this.props.playingItem.url
			console.log(this.getLabel(this.props.playingItem))
			this.setState({ status: "Loading..." })
		}
	}

	playItem(item) {
		console.log(item)
		this.midiPlayerRef.current.src = item.url
		this.setState({
			title: this.getLabel(item),
			status: "Loading..."
		})
	}

	getLabel(item) {
		if (item.label !== null) {
			return item.label.name
		} else if (item.sight_reading === true) {
			return "Sight Reading"
		} else if (item.technical === true) {
			return "Technical"
		}
		return ""
	}

	render() {
		return (
			<span>
				<midi-player id="midi-player" sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus" ref={this.midiPlayerRef} />
				<span className="status" centered>{this.state.status}</span>
			</span>
		);
	}
}
