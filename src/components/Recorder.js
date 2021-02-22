import { Alert, Card, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { encode } from 'json-midi-encoder';
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form } from 'react-bootstrap';
import { Piano } from 'react-piano';
import React from 'react';
import Soundfont from 'soundfont-player';
import WebMidi from 'webmidi';

import 'react-piano/dist/styles.css';

import { formatDuration } from '../utils/TimeFormatUtils'
import NoSleep from '../lib/nosleep'

import './Recorder.css';

export default class Recorder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			available: false,
			recording: false,
			velocity: 0,
			activeNotes: new Set(),
			startTime: null,
			noteRecorded: false,
			shouldPlay: false,
			message: null,
			recordDuration: null,
			noSleep: new NoSleep(),
			playingNotes: {},
			sustain: false,
			sustainedNotes: [],
			metadata: [],
			labels: []
		}

		this.track = null
		this.recordTimer = null
		this.recordingDurationTimer = null
		this.labelOptions = ['None', 'Sight Reading', 'Technical']
	}

	componentDidMount() {
		this.initMidi()
		this.props.api.loadLabels().then((labels) => {
			this.setState({
				labels: labels
			})
		})
	}

	initMidi = () => {
		const recorder = this;
		WebMidi.enable(function (err) {
			if (err) {
				console.log("WebMidi could not be enabled.", err);
			} else {
				console.log("WebMidi enabled!");
				recorder.registerMidiDevices()
			}
		})
	}

	registerMidiDevices = () => {
		const recorder = this;
		var AudioContext = window.AudioContext // Default
			|| window.webkitAudioContext;// Safari and old versions of Chrome

		const ac = new AudioContext();
		Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
			for (const i in WebMidi.inputs) {
				recorder.setState({
					available: true
				})
				const input = WebMidi.inputs[i]

				input.addListener('noteon', "all", function (e) {
					recorder.recordNoteOn(recorder.epochTime(), e.note.number, e.rawVelocity)
					if (recorder.state.shouldPlay) {
						let playingNotes = recorder.state.playingNotes;
						playingNotes[e.note.number] = piano.play(e.note.number)
						recorder.setState({
							playingNotes: playingNotes
						})
					}
				});
				input.addListener('noteoff', "all", function (e) {
					recorder.recordNoteOff(recorder.epochTime(), e.note.number)
					if (recorder.state.shouldPlay) {
						let playingNotes = recorder.state.playingNotes;
						const playingNote = playingNotes[e.note.number]
						if (recorder.state.sustain) {
							let sustainedNotes = recorder.state.sustainedNotes
							sustainedNotes.push(playingNote)
							recorder.setState({
								sustainedNotes: sustainedNotes
							})
						} else {
							playingNote.stop(ac.currentTime)
						}
						delete playingNotes[e.note.number]
						recorder.setState({
							playingNotes: playingNotes
						})
					}
				});
				input.addListener('controlchange', "all", function (e) {
					recorder.recordCC(recorder.epochTime(), e.controller.number, e.value)
					if (e.controller.number === 64) {
						const sustain = e.value > 64
						recorder.setState({
							sustain: sustain
						})
						if (!sustain) {
							for (const note of recorder.state.sustainedNotes) {
								note.stop(ac.currentTime)
							}
							recorder.setState({
								sustainedNotes: []
							})
						}
					}
				});
			}
		})
	}
	startRecordTimeoutTimer = () => {
		this.recordTimer = setTimeout(() => {
			console.log("timer hit!")
			this.stopRecord()
			this.startRecord()
		}, 15 * 60 * 1000); // 15 minutes
	}

	startRecordDurationTimer = () => {
		this.recordingDurationTimer = setInterval(() => {
			const recordDuration = formatDuration(Math.floor(this.epochTime() - this.state.startTime))
			this.setState({
				message: `Recording ${recordDuration}`,
				recordDuration: recordDuration
			})
		}, 1000);
	}

	endRecordDurationTimer = () => {
		if (this.recordingDurationTimer !== null) {
			clearTimeout(this.recordingDurationTimer);
			this.recordingDurationTimer = null;
		}
	}

	refreshTimer = () => {
		this.endRecordTimeoutTimer()
		this.startRecordTimeoutTimer()
	}

	endRecordTimeoutTimer = () => {
		if (this.recordTimer !== null) {
			clearTimeout(this.recordTimer);
			this.recordTimer = null;
		}
	}

	recordNoteOn = (time, pitch, velocity) => {
		const event = {
			"noteOn": {
				"noteNumber": pitch,
				"velocity": velocity
			}
		}
		const activeNotes = new Set(this.state.activeNotes)
		activeNotes.add(pitch)
		this.setState({
			velocity: velocity,
			activeNotes: activeNotes,
			noteRecorded: true
		})
		this.recordEvent(time, event)
	}

	recordNoteOff = (time, pitch) => {
		const event = {
			"noteOff": {
				"noteNumber": pitch
			}
		}
		const activeNotes = new Set(this.state.activeNotes)
		activeNotes.delete(pitch)
		this.setState({
			velocity: 0,
			activeNotes: activeNotes
		})
		this.recordEvent(time, event)
	}

	recordCC = (time, number, value) => {
		const event = {
			"controlChange": {
				"type": number,
				"value": value
			}
		}
		this.recordEvent(time, event)
	}

	recordEvent = (time, event) => {
		this.refreshTimer()
		const delta = time - this.lastTime
		this.lastTime = time
		const fullEvent = {
			channel: 0,
			delta: this.sec2ticks(delta),
			...event
		}
		if (this.track !== null) {
			this.track.push(fullEvent)
		}
	}

	startRecord = () => {
		this.state.noSleep.enable()
		this.lastTime = this.epochTime()
		this.track = [
			{
				"delta": 0,
				"trackName": "scale"
			},
		];
		this.setState({
			recording: true,
			noteRecorded: false,
			startTime: this.epochTime(),
			metadata: [{
				time: 0,
				value: "None"
			}]
		})
		this.startRecordTimeoutTimer()
		this.startRecordDurationTimer()
	}


	stopRecord = () => {
		this.endRecordDurationTimer()
		this.endRecordTimeoutTimer()
		const message = `Uploading recording of duration ${this.state.recordDuration}...`
		this.setState({
			recording: false,
			message: message
		})

		this.track.push({
			"delta": 0,
			"endOfTrack": true
		})
		this.state.noSleep.disable()
		if (this.state.noteRecorded === true) {
			let midiFile = this.newMidiTrack()
			midiFile.tracks.push(this.track)

			console.log(midiFile)

			encode(midiFile)
				.then((arrayBuffer) => {
					var blob = new Blob([arrayBuffer], {
						type: 'audio/midi'
					});
					// used for testing by downloading URI from console
					// var a = new FileReader();
					// a.onload = function(e) {
					// 	console.log(e.target.result);
					// }
					// a.readAsDataURL(blob);
					// ---end
					const lastModified = Math.floor(new Date().valueOf() / 1000)
					const filename = `${lastModified.toString()}.mid`
					const file = new File([blob], filename)
					this.props.api.uploadFileFlow(file, lastModified, this.state.metadata).then(() => {
						console.log("recorded file uploaded!")
						this.setState({
							message: "✅ Recording Uploaded!"
						})
					})
				})
		}

		this.track = null;
	}

	epochTime = () => {
		return new Date().valueOf() / 1000
	}

	sec2ticks = (secs) => {
		return secs * 8 * 240 * 2 / 4 // 120 bpm
	}

	metadataButtonClicked = (e) => {
		this.updateMetadata(e.target.value)
	}
	updateMetadata = (value) => {
		const metadata = this.state.metadata
		metadata.push({
			time: (this.epochTime() - this.state.startTime).toFixed(2),
			value: value
		})
		console.log(metadata)
		this.setState({ metadata: metadata })
	}

	render() {
		const activeNotes = [...this.state.activeNotes]
		return (
			<span className="recorder">
				<Card>

					{this.state.message !== null
						? <Alert key='0' variant='info'>
							<h5>{this.state.message}</h5>
						</Alert>
						: ""
					}
					{this.state.available
						? <p>{this.state.recording
							? <span>
								<p>
									<Button variant="primary" onClick={this.stopRecord}>
										Stop (vol: {this.state.velocity})
									</Button>
								</p>
								<p>
									<Form.Check inline label="Play Sound" type="checkbox" checked={this.state.shouldPlay} onChange={() => { this.setState({ shouldPlay: !this.state.shouldPlay }) }} />
								</p>
								<p>
									<ButtonGroup toggle={true}>
										{
											this.labelOptions.map((item, index) =>
												<Button value={item} onClick={this.metadataButtonClicked}>{item}</Button>
											)
										}
										{this.state.labels.length > 0
											? <DropdownButton title="Pieces" onSelect={this.updateMetadata}>
												{this.state.labels.map((label, index) =>
													<Dropdown.Item eventKey={label.name}>{label.name}</Dropdown.Item>
												)}
											</DropdownButton>
											: ""
										}
									</ButtonGroup>
								</p>
								<p>
									Currently Playing: {this.state.metadata[this.state.metadata.length - 1].value}
								</p>
								<p className="recorder-card">
									<Piano
										activeNotes={activeNotes}
										noteRange={{ first: 45, last: 88 }}
										playNote={(midiNumber) => {
										}}
										stopNote={(midiNumber) => {
										}}
									/>
								</p>
							</span>
							: <Button variant="danger" onClick={this.startRecord}>Record</Button>
						}</p>

						: <>
							<Alert key='0' variant='primary'>
								<p>No compatible MIDI devices found</p>
								<p>Connect your MIDI controller, use Chrome and refresh!</p>
						This doesn't work on an iPad so please use a computer or Android device
						</Alert>
							<Button variant="primary" onClick={this.registerMidiDevices}>
								<FontAwesomeIcon icon={faRedo} />
							</Button>
						</>
					}
				</Card>
			</span >
		);
	}

	newMidiTrack() {
		return {
			"division": 480,
			"format": 1,
			"tracks": [
				[{
					"delta": 0,
					"trackName": "scale"
				},
				{
					"delta": 0,
					"setTempo": {
						"microsecondsPerQuarter": 500000
					}
				},
				{
					"delta": 0,
					"timeSignature": {
						"denominator": 4,
						"metronome": 24,
						"numerator": 4,
						"thirtyseconds": 8
					}
				},
				{
					"delta": 0,
					"endOfTrack": true
				}]
			]
		}
	}
}
