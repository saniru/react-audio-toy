import { Component } from 'react';
import FileInput from './FileInput';
import URLInput from './URLInput';
import { Track } from './Track';
import { FileTrack, YouTubeTrack, AudioTrack } from './AudioTrack';
interface TrackManagerState {
  tracklist: Array<AudioTrack>;
  url: String;
  file: String;
};
interface TrackManagerProps {

}
export class TrackManager extends Component {
  state: TrackManagerState;
  declare props: TrackManagerProps;
  constructor(props: TrackManagerProps) {
    super(props);
    this.state = {
      tracklist: [],
      url: "",
      file: ""
    };
  }
  handleFile = async (f: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const atag = new Audio();
        atag.src = reader.result as string;
        atag.addEventListener("loadeddata", () => {
          resolve(new FileTrack(atag, f.name));
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  };
  getFile = async (f: FileList) => {
    const ff = await Promise.all([...f].map(async f => {
      return await this.handleFile(f);
    }));
    this.setState({
      file: f[0],
      tracklist: [...this.state.tracklist, ...ff]
    });
  };
  getValue = (val: string) => {
    try {
      const url = new URL(val);
      const msg = url.host != "www.youtube.com" ? "INVALID" : "VALID";
      console.log(msg);
      this.setState({ url: val, tracklist: [...this.state.tracklist, url] });
    }
    catch (e) {
    }
  };
  changeVolume = (t: AudioTrack, val: number) => {
    this.setState((prevState: any) => ({
      tracklist: prevState.tracklist.map(
        (el: AudioTrack) => el === t ? { ...el, volume: val } : el
      )
    }))
  };
  changeDelay = (t: AudioTrack, val: number) => {
    this.setState((prevState: any) => ({
      tracklist: prevState.tracklist.map(
        (el: AudioTrack) => el === t ? { ...el, delay: val } : el
      )
    }))
  };
  changePlaying = (t: AudioTrack, val: boolean) => {
    this.setState((prevState: any) => ({
      tracklist: prevState.tracklist.map(
        (el: AudioTrack) => el === t ? { ...el, playing: val } : el
      )
    }))
  };
  render() {
    return (
      <div>
        <ul>{this.state.tracklist.map(e => <li>{e.href ?? e.name}</li>)}</ul>
        <URLInput getValue={this.getValue} />
        <FileInput getFile={this.getFile} />
      </div>
    );
  }
}

export default TrackManager;
