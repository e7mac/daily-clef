import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { matchPath } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
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
    const hash = window.location.hash;
    const labelMatch = hash.match(/#\/label\/(.+)/);
    return labelMatch ? labelMatch[1] : null;
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

  loadAllClips = () => {
    this.props.api.resetLoadClips()
  }

  loadClips = () => {
    this.props.api.clipGetter.loadMoreClips().then((clipgroupsets) => {
      this.setState(prevState => ({
        items: [...prevState.items, ...clipgroupsets],
        hasMore: this.props.api.clipGetter.hasMore
      }))
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
    }, () => this.loadClips())
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
          loader={<Card key={0}><Spinner animation="border" variant="secondary" /></Card>}
        >
          {this.state.items.map((item, index) => (
            <Card key={index}>
              <ClipGroupSet
                api={this.props.api}
                set={item}
                onPlay={this.props.onPlay}
                onRelabel={this.props.onRelabel}
                playingItem={this.props.playingItem}
              />
            </Card>
          ))}
        </InfiniteScroll>
      </>
    );
  }
}
