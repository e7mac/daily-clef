import { Card, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller'
import React from 'react';

import ClipGroupSet from './ClipGroupSet';

export default function MusicLog(props) {

	return (
		<InfiniteScroll
			threshold={0}
			pageStart={0}
			loadMore={props.loadClips}
			hasMore={props.api.clipGetter.hasMore}
			loader={<Card><Spinner animation="border" variant="secondary" /></Card>}>
			{props.items.map((item, index) =>
				<Card><ClipGroupSet api={props.api} key={item.title} set={item} onPlay={props.onPlay} onRelabel={props.onRelabel} /></Card>
			)}
		</InfiniteScroll>
	);
}
