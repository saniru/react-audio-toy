import { Component } from 'react';
import FileInput from './FileInput';
import URLInput from './URLInput';
interface TrackManagerState {
  tracklist: Array<URL | File>;
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
  getFile = (f: FileList) => {
    this.setState({ file: f[0], tracklist: [...this.state.tracklist, ...f] });
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
