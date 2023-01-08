import React, { Component } from 'react';
interface TrackProps {
  id: String;
  dispatch: Function;
  playTrack: Function;
  playing: boolean;
  delay: number;
  name: string;
  TrackType: string;
}
enum TrackMode {
  Random,
  AtWill,
}
interface TrackState {
  volume: number;
  delay: number;
  mode: TrackMode;
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class Track extends Component {
  declare state: TrackState;
  declare props: TrackProps;
  TrackTimer: React.MutableRefObject<any>;
  constructor(props: TrackProps) {
    super(props);
    this.TrackTimer = React.createRef();
    this.state = {
      volume: 50,
      delay: this.props.delay,
      mode: TrackMode.Random
    };
  }
  componentDidMount = () => {
    const rand = getRandomArbitrary(this.props.delay / 2, this.props.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay, rand);
  };
  componentWillUnmount = () => {
    clearTimeout(this.TrackTimer.current);
  };
  randomPlay = () => {
    if (this.props.playing && this.state.mode == TrackMode.Random) {
      this.props.playTrack(this.props.id);
    }
    const rand = getRandomArbitrary(this.props.delay / 2, this.props.delay);
    this.TrackTimer.current = setTimeout(this.randomPlay, rand);
  };
  handleVolume = (e: any) => {
    this.setState({ volume: e.target.value });
    this.props.dispatch({ type: "volume", payload: { id: this.props.id, val: this.state.volume } });
  };
  handleDelay = (e: any) => {
    this.setState({ delay: e.target.value });
    this.props.dispatch({ type: "delay", payload: { id: this.props.id, val: this.state.delay } });
  };
  render() {
    const buttons = {
      [TrackMode.Random]: <button onClick={() => this.props.dispatch({ type: "playing", payload: { id: this.props.id } })}
        name="playing">{this.props.playing ? "Pause" : "Play"}</button>,
      [TrackMode.AtWill]: <button onClick={() => this.props.playTrack(this.props.id)}>Play</button>
    };
    const titles = {
      [TrackMode.Random]: <h3>Randomly playing</h3>,
      [TrackMode.AtWill]: <h3>Playing at will</h3>
    };
    return (
      <div>
        <pre>{this.props.name}</pre>
        <pre>{this.props.TrackType}</pre>
        <pre>{titles[this.state.mode]}</pre>
        <button onClick={() => this.setState((state: TrackState, _) => ({
          mode: (state.mode + 1) % (Object.keys(TrackMode).length / 2)
        }))}>Switch Mode</button>
        <input onChange={(e) => this.handleVolume(e)} name="volume" type="range" min="1" max="100" />
        <input onChange={(e) => this.handleDelay(e)} name="delay" type="range" min={30 * 1000} max={30 * 60 * 1000} step={1000} value={this.state.delay} />
        {buttons[this.state.mode]}
        <button onClick={() => this.props.dispatch({ type: "remove", payload: { id: this.props.id } })}>Remove</button>
      </div>
    );
  }
};

export default Track;
