import React, { useState, useEffect, useRef } from 'react';

import APIService from '../services/APIService'
import ClipGroupSet from './ClipGroupSet';
import InfiniteScroll from 'react-infinite-scroller'
import Navbar from './Navbar'
import LabelBar from './LabelBar'
import Upload from './Upload'
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';

export default function MusicLog(props) {
	const [loaded, setLoaded] = useState(false)
	const [clipgroupsets, setClipgroupsets] = useState([])
	const [selectedDays, setSelectedDays] = useState([])
	const [showCalendar, setShowCalendar] = useState(true)
	const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false)
	const [playingItem, setPlayingItem] = useState(null)

	useEffect(() => {
		loadCalendar()
  	}, []) // notice the empty array

	const onRelabel = (clip_id, label_name) => {
		console.log(clip_id, label_name)
	}

	const loadClips = () => {
		props.api.loadClips().then((clipgroupsets_) => {
			setClipgroupsets(clipgroupsets_)
			setLoaded(true)
		})
	}

	const resetLoadClips = (e) => {
		e.preventDefault()
		props.api.resetLoadClips()
		setClipgroupsets([])
		setLoaded(false)		
	}

	const loadClipsForLabel = (label) => {
		props.api.loadClipsForLabel(label)
		setClipgroupsets([])
		setLoaded(false)
	}

	const loadCalendar = () => {
		props.api.loadRawSessionFiles()
		.then((rawsessionfiles) => {
			console.log(rawsessionfiles)
			const selectedDays_ = []
			for (const item of rawsessionfiles) {
				selectedDays_.push(new Date(item['date_played']))
			}
			setSelectedDays(selectedDays_)
		})
	}

	const onPlay = (item) => {
		setPlayingItem(item)
	}

	const handleDayClick = (day) => {
		console.log(day)
	}

	return (
		<div>
		<a onClick={resetLoadClips}><h1 className="link">Daily Clef</h1></a>
		<Navbar api={props.api} playingItem={playingItem} handle_logout={props.handle_logout} />
		<LabelBar api={props.api} loadClipsForLabel={loadClipsForLabel} />
		<Upload api={props.api} />
		{showCalendar 
			? <DayPicker
			onDayClick={handleDayClick}
			selectedDays={selectedDays}
			/>
			: <br />
		}
		<InfiniteScroll
		threshold={0}
		pageStart={0}
		loadMore={loadClips}
		hasMore={props.api.hasMore}
		loader={<div className="text-center">loading data ...</div>}>
		{clipgroupsets.map((item, index) => 
			( 
			<ClipGroupSet api={props.api} key={item.title} set={item} onPlay={onPlay} onRelabel={onRelabel} />
			)
			)}
			</InfiniteScroll>
			</div>
			);
		}
