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
	const [loggedIn, setLoggedIn] = useState(false)
	const [playingItem, setPlayingItem] = useState(null)
	const [api, setAPI] = useState(new APIService())

	useEffect(() => {
  		loadCalendar()
  	}, []) // notice the empty array

	const onRelabel = (clip_id, label_name) => {
		console.log(clip_id, label_name)
	}

	const loadClips = () => {
		api.loadClips().then((clipgroupsets_) => {
			setClipgroupsets(clipgroupsets_)
			setLoaded(true)
		})
	}

	const loadCalendar = () => {
		api.loadRawSessionFiles()
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
		<a href="/"><h1>Music Log</h1></a>
		<Navbar api={api} playingItem={playingItem} />
		<LabelBar api={api} />
		<Upload api={api} />
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
		hasMore={api.hasMore}
		loader={<div className="text-center">loading data ...</div>}>
		{clipgroupsets.map((item, index) => 
			( 
			<ClipGroupSet api={api} key={item.title} set={item} edit={api.ownUsername} onPlay={onPlay} onRelabel={onRelabel} />
			)
			)}
			</InfiniteScroll>
			</div>
			);
		}
