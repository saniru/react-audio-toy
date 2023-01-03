import React, { Component } from 'react';
import { AudioTrack } from './AudioTrack';
interface TrackProps{
  track:AudioTrack;
  changeVolume:Function;
  changeDelay:Function;
  changePlaying:Function;
}
interface TrackState{
  volume:number;
  delay:number;
  playing:boolean;
}
export class Track extends Component {
  state:TrackState;
  declare props: TrackProps
  constructor(props: TrackProps) {
    super(props);

    this.state = {
      volume:0,
      delay:0,
      playing:false
    };
  }
  handleVolume = (e: any) =>{
    this.setState({volume:e.target.value});
    this.props.changeVolume(this.props.track,this.state.volume);
  };
  handleDelay = (e:any) =>{
    this.setState({delay:e.target.value});
    this.props.changeDelay(this.props.track,this.state.delay);
  };
  handlePlaying = (e:any) =>{
    this.setState({playing:!this.state.playing});
    this.props.changePlaying(this.props.track,!this.state.playing);
  };
  render() {
    return (
      <div>
        <pre>{this.props.track.name}</pre>
        <pre>{this.props.track.TrackType}</pre>
        <input onChange={(e) => this.handleVolume(e)} name="volume" type="range" min="1" max="100"/>
        <input onChange={(e) => this.handleDelay(e)} name="delay" type="range" min={30*1000} max={30*60*1000} step={60} />
      <button onClick={(e) => this.handlePlaying(e)}name="playing">{this.state.playing ? "Pause" : "Play"}</button>
      </div>
    );
  }
}

export default Track;
