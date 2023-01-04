import React, { Component } from 'react';
import { AudioTrack } from './AudioTrack';
interface TrackProps{
  track:AudioTrack;
  changeVolume:Function;
  changeDelay:Function;
  changePlaying:Function;
  playTrack:Function;
}
interface TrackState{
  volume:number;
  delay:number;
  playing:boolean;
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
function getRandomArbitrary(min : number, max : number) {
    return Math.random() * (max - min) + min;
}

export class Track extends Component {
  declare state: TrackState;
  declare props: TrackProps;
  TrackTimer:React.MutableRefObject<any>;
  constructor(props: TrackProps) {
    super(props);
    this.TrackTimer = React.createRef();
    this.state = {
      volume:this.props.track.getVolume(),
      delay:this.props.track.delay,
      playing:this.props.track.playing
    };
  }
  componentDidMount = () => {
    const rand = getRandomArbitrary(this.props.track.delay/2, this.props.track.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay,rand);
    return () => clearTimeout(this.TrackTimer.current);
  };
  randomPlay = () => {
    if (this.props.track.playing) {
      this.props.playTrack(this.props.track);
    }
    const rand = getRandomArbitrary(this.props.track.delay/2, this.props.track.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay,rand);
  };
  handleVolume = (e: any) =>{
    this.setState({volume:e.target.value});
    this.props.changeVolume(this.props.track,this.state.volume);
  };
  handleDelay = (e:any) =>{
    this.setState({delay:e.target.value});
    this.props.changeDelay(this.props.track,this.state.delay);
  };
  handlePlaying = (_:any) =>{
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

