import { Card, Spinner } from 'react-bootstrap';
import { matchPath } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import React from 'react';

import PlayCalendar from './PlayCalendar'
import ClipGroupSet from './ClipGroupSet';

import ClipGetter from '../services/ClipGetter';

export default class MusicLog extends React.Component {
	constructor(props) {
		super(props)
		const label = this.getLabelFromPath()
		this.state = {
			items: [],
			hasMore: true,
			label: label
		}
		if (label != null) {
			this.loadClipsForLabel(label)
		}
	}

	getLabelFromPath = () => {
		const match = matchPath(window.location.hash, {
			path: "#/label/:label",
			exact: false,
			strict: false
		})
		let label = null
		if (match !== null && match !== undefined) {
			if (match.params.label !== null) {
				label = match.params.label
			}
		}
		return label
	}

	componentDidUpdate(prevProps, prevState) {
		const label = this.getLabelFromPath()
		if (label !== this.state.label) {
			console.log('label change')
			this.setState({
				items: [],
				hasMore: true,
				label: label
			})
			if (label === null) {
				this.loadAllClips()
			} else {
				this.loadClipsForLabel(label)
			}
		}
	}

	loadClipsForLabel = (label) => {
		this.props.api.loadClipsForLabel(label)
	}

	loadAllClips = (label) => {
		this.props.api.resetLoadClips()
	}

	loadClips = () => {
		this.props.api.clipGetter.loadMoreClips().then((clipgroupsets) => {
			this.setState({
				items: clipgroupsets,
				hasMore: this.props.api.clipGetter.hasMore
			})
		})
	}

	onTimeChanged = (startTime, endTime) => {
		this.props.api.clipGetter = new ClipGetter(this.props.api)
		const searchParams = {
			start_time: startTime,
			end_time: endTime,
		}
		if (this.state.label) {
			searchParams.label = this.state.label
		}
		this.props.api.clipGetter.modelGetter.searchParams = searchParams
		this.setState({
			items: [],
			hasMore: true,
		})
		// this.props.api.clipGetter.loadMoreClips().then((clipgroupsets) => {
		// 	this.setState({
		// 		items: clipgroupsets,
		// 		hasMore: this.props.api.clipGetter.hasMore
		// 	})
		// })
	}

	render() {
		return (
			<>
				<PlayCalendar api={this.props.api} onTimeChanged={this.onTimeChanged} />
				<InfiniteScroll
					threshold={0}
					pageStart={0}
					loadMore={this.loadClips}
					hasMore={this.state.hasMore}
					loader={< Card > <Spinner animation="border" variant="secondary" /></Card>}>
					{
						this.state.items.map((item, index) =>
							<Card><ClipGroupSet api={this.props.api} key={item.title} set={item} onPlay={this.props.onPlay} onRelabel={this.props.onRelabel} /></Card>
						)
					}
				</InfiniteScroll >
			</>
		);
	}

}