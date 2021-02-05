import { Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller'
import React from 'react';
import { matchPath } from 'react-router-dom'

import ClipGroupSet from './ClipGroupSet';

export default class MusicLog extends React.Component {
	constructor(props) {
		super(props)
		const match = matchPath(window.location.hash, {
			path: "#/label/:label",
			exact: false,
			strict: false
		})
		let label = null
		if (match !== null && match !== undefined) {
			if (match.params.label !== null) {
				label = match.params.label
				this.loadClipsForLabel(label)
			}
		}
		this.state = {
			items: [],
			label: label
		}
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('update')
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
		if (label != this.state.label) {
			this.setState({ items: [], label: label })
			this.loadClipsForLabel(label)
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
			})
		})
	}

	render() {
		return (
			<InfiniteScroll
				threshold={0}
				pageStart={0}
				loadMore={this.loadClips}
				hasMore={this.props.api.clipGetter.hasMore}
				loader={< Card > <Spinner animation="border" variant="secondary" /></Card>}>
				{
					this.state.items.map((item, index) =>
						<Card><ClipGroupSet api={this.props.api} key={item.title} set={item} onPlay={this.props.onPlay} onRelabel={this.props.onRelabel} /></Card>
					)
				}
			</InfiniteScroll >
		);
	}

}