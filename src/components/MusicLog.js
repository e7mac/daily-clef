import { Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller'
import React from 'react';
import { matchPath } from 'react-router-dom'

import ClipGroupSet from './ClipGroupSet';

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

	render() {
		return (
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
		);
	}

}