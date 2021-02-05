import { Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller'
import { matchPath } from "react-router";
import React from 'react';

import ClipGroupSet from './ClipGroupSet';

export default class MusicLog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
		}
		const match = matchPath(window.location.pathname, {
			path: "/daily-clef/:label",
			exact: true,
			strict: false
		});
		if (match != null) {
			const label = match.params.label
			if (label !== undefined || label !== null) {
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