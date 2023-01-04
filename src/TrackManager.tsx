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
  createPlayerDummy(url: string) {
    return new Promise((resolve, reject) => {
      const div = document.createElement("div");
      document.body.appendChild(div);
      div.id = "player-" + url + Date.now();
      div.hidden = true;
      const options = {
        controls: 0,
        modestbranding: true,
        showinfo: 0,
      };
      const events = { "onReady": onPlayerReady };
      new YT.Player(div.id, { videoId: url, playerVars: options, events });
      document.getElementById(div.id)!.hidden = true;
      function onPlayerReady(event: any) {
        resolve(event.target);
      }
    }
    );
  }
  handleYoutube = async (url: URL) => {
    const player = await this.createPlayerDummy(url.searchParams.get("v") as string);
    return new YouTubeTrack(player);
  };
  getValue = async (val: string) => {
    try {
      const url = new URL(val);
      const msg = url.host != "www.youtube.com" ? "INVALID" : "VALID";
      const yt = await this.handleYoutube(url);
      this.setState({ url: val, tracklist: [...this.state.tracklist, yt] });
    }
    catch (e) {
    }
  };
  changeVolume = (t: AudioTrack, val: number) => {
    const newtracklist: AudioTrack[] = [];
    for (let track of this.state.tracklist) {
      if (track === t) {
        const newtrack = t;
        t.setVolume(val);
        newtracklist.push(newtrack);
      }
      else{
        newtracklist.push(track);
      }
    }
    this.setState((prevState:any) =>({tracklist:newtracklist}));
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
        <div>
          <ul>
            {this.state.tracklist.map(e => <Track key={`${e.name}_${e.CreateDate}`} track={e} changeVolume={this.changeVolume} changeDelay={this.changeDelay} changePlaying={this.changePlaying} />)}
          </ul>
        </div>
        <URLInput getValue={this.getValue} />
        <FileInput getFile={this.getFile} />
      </div>
    );
  }
}

export default TrackManager;
