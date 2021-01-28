import React from 'react';

import { Card, Spinner } from 'react-bootstrap';

import ClipGroupSet from './ClipGroupSet';
import InfiniteScroll from 'react-infinite-scroller'

export default function MusicLog(props) {

	const onRelabel = (clip_id, label_name) => {
		console.log(clip_id, label_name)
	}

	return (
		<InfiniteScroll
			threshold={0}
			pageStart={0}
			loadMore={props.loadClips}
			hasMore={props.api.clipGetter.hasMore}
			loader={
				<Card><Spinner animation="border" variant="secondary" /></Card>
			}/>
		{props.items.map((item, index) => 
			<Card><ClipGroupSet api={props.api} key={item.title} set={item} onPlay={props.onPlay} onRelabel={onRelabel} /></Card>
		)}
		</InfiniteScroll>
	);
}
