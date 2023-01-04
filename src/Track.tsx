import React, { Component } from 'react';
interface TrackProps{
  id:String;
  dispatch:Function;
  playTrack:Function;
  playing:boolean;
  delay:number;
  name:string;
  TrackType:string;
}
interface TrackState{
  volume:number;
  delay:number;
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
      volume:50,
      delay:this.props.delay,
    };
  }
  componentDidMount = () => {
    const rand = getRandomArbitrary(this.props.delay/2, this.props.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay,rand);
    return () => clearTimeout(this.TrackTimer.current);
  };
  randomPlay = () => {
    if (this.props.playing) {
      this.props.playTrack(this.props.id);
    }
    const rand = getRandomArbitrary(this.props.delay/2, this.props.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay,rand);
  };
  handleVolume = (e: any) =>{
    this.setState({volume:e.target.value});
    this.props.dispatch({type:"volume",payload:{id:this.props.id,val:this.state.volume}});
  };
  handleDelay = (e:any) =>{
    this.setState({delay:e.target.value});
    this.props.dispatch({type:"delay",payload:{id:this.props.id,val:this.state.delay}});
  };
  render() {
    return (
      <div>
        <pre>{this.props.name}</pre>
        <pre>{this.props.TrackType}</pre>
        <input onChange={(e) => this.handleVolume(e)} name="volume" type="range" min="1" max="100"/>
        <input onChange={(e) => this.handleDelay(e)} name="delay" type="range" min={30*1000} max={30*60*1000} step={1000} />
        <button onClick={() => this.props.dispatch({type:"playing",payload:{id:this.props.id}})}
                name="playing">{this.props.playing ? "Pause" : "Play"}</button>
      </div>
    );
  }
};

export default Track;

