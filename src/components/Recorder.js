import React from 'react';

import './Recorder.css';
import { encode } from 'json-midi-encoder';
import WebMidi from 'webmidi';

import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

// import SoundFontPlayer from "soundfont-player";

export default class Recorder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			available: false,
			recording: false,
			velocity: 0,
			activeNotes: new Set()
		}
		this.track = null
		this.startRecord = this.startRecord.bind(this);
		this.stopRecord = this.stopRecord.bind(this);
		this.recordNoteOn = this.recordNoteOn.bind(this);
		this.recordNoteOff = this.recordNoteOff.bind(this);
		this.recordCC = this.recordCC.bind(this);
		this.recordEvent = this.recordEvent.bind(this);

		this.recordTimer = null
		this.noteRecorded = false
	}

	componentDidMount() {
		// Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(function (piano) {
		// 	window.navigator.requestMIDIAccess().then(function (midiAccess) {
		// 		midiAccess.inputs.forEach(function (midiInput) {
		// 			piano.listenToMidi(midiInput)
		// 		})
		// 	})
		// })
		const recorder = this;
		WebMidi.enable(function (err) {
			if (err) {
				console.log("WebMidi could not be enabled.", err);
			} else {
				console.log("WebMidi enabled!");
				for (const i in WebMidi.inputs) {
					recorder.setState({
						available: true
					})					
					const input = WebMidi.inputs[i]
					// piano.listenToMidi(input)
					input.addListener('noteon', "all", function (e) {
						recorder.recordNoteOn(e.note.number, e.rawVelocity)
					});
					input.addListener('noteoff', "all", function (e) {
						recorder.recordNoteOff(e.note.number)
					});
					input.addListener('controlchange', "all", function (e) {
						recorder.recordCC(e.controller.number, e.value)
					});
				}
			}
		})

	}

	startTimer() {
		this.recordTimer = setTimeout( () => {
			console.log("timer hit!")
			this.stopRecord()
			this.startRecord()
		}, 
		15 * 60 * 1000); // 15 minutes
	}

	refreshTimer() {
		this.endTimer()
		this.startTimer()
	}

	endTimer() {
		if (this.recordTimer !== null) {
			clearTimeout(this.recordTimer);
		}		
	}


	recordNoteOn(pitch, velocity) {
		this.noteRecorded = true
		const event = 	{
			"noteOn": {
				"noteNumber": pitch,
				"velocity": velocity
			}
		}
		const activeNotes = new Set(this.state.activeNotes)
		activeNotes.add(pitch)
		this.setState({
			velocity: velocity,
			activeNotes: activeNotes
		})		
		this.recordEvent(event)
	}

	recordNoteOff(pitch) {
		const event = 	{
			"noteOff": {
				"noteNumber": pitch
			}
		}
		const activeNotes = new Set(this.state.activeNotes)
		const index = activeNotes.delete(pitch)
		this.setState({
			velocity: 0,
			activeNotes: activeNotes
		})
		this.recordEvent(event)
	}

	recordCC(number, value) {
		const event = 	{
			"controlChange": {
				"type": number,
				"value": value
			}
		}
		this.recordEvent(event)
	}

	recordEvent(event) {
		this.refreshTimer()
		const time = this.epochTime()
		const delta = time - this.lastTime
		this.lastTime = time
		const fullEvent = {
			channel: 0,
			delta: this.sec2ticks(delta),
			...event
		}
		if (this.track!==null) {
			this.track.push(fullEvent)
		}
	}

	startRecord() {
		this.noteRecorded = false
		this.lastTime = this.epochTime()
		this.track = [
		{
			"delta": 0,
			"trackName": "scale"
		},
		];
		this.setState({
			recording: true
		})
		this.startTimer()
	}


	stopRecord() {
		this.endTimer()
		this.setState({
			recording: false
		})

		this.track.push({
			"delta": 0,
			"endOfTrack": true
		})

		if (this.noteRecorded === true) {
			let midiFile = this.newMidiTrack()
			midiFile.tracks.push(this.track)

			console.log(midiFile)

			encode(midiFile)
			.then((arrayBuffer) => {
				console.log(arrayBuffer)
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
    		const lastModified = Math.floor(new Date().valueOf()/1000)
    		const filename = lastModified.toString() + ".mid"
    		const file = new File([blob], filename)
    		this.props.api.uploadFileFlow(file, lastModified).then(() => {
    			console.log("recorded file uploaded!")
    		})
    	})
		}

		this.track = null;
	}

	epochTime() {
		return new Date().valueOf()/1000
	}

	sec2ticks(secs) {
		return secs * 8 * 240 * 2 / 4 // 120 bpm
	}

	render() {
		const activeNotes = [...this.state.activeNotes]
		return (
			<span className="recorder">
			{this.state.available
				? <span>{this.state.recording
					? <span onClick={this.stopRecord} > Stop  (vol: {this.state.velocity})
					<Piano
					activeNotes={activeNotes}
					noteRange={{ first: 60, last: 88 }}
					playNote={(midiNumber) => {
        				}}
        				stopNote={(midiNumber) => {
				    }}
				    width={1000}
				    />				
				    </span>
				    : <span onClick={this.startRecord} > Rec </span>
				}</span>
				: <br />
			}
			</span>
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
