import { Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller'
import React from 'react';

import ClipGroupSet from './ClipGroupSet';

export default class MusicLog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: []
		}
	}

	loadClipsForLabel = (label) => {
		this.setState({
			items: []
		})
		this.props.api.loadClipsForLabel(label)
	}

	loadAllClips = (label) => {
		this.setState({
			items: []
		})
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