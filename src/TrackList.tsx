import { AudioTrack } from "./AudioTrack";
import { Track } from "./Track";
import { TrackAction } from "./TrackManager";

function TrackList(props: { dispatch: React.Dispatch<TrackAction>, tracks: AudioTrack[], playTrack: (id:string) => void }) {
  return (<>
    <ul>
      {props.tracks.map(e => <Track
        key={e.id}
        id={e.id}
        dispatch={props.dispatch}
        playTrack={props.playTrack}
        playing={e.playing}
        delay={e.delay}
        name={e.name}
        TrackType={e.TrackType} />)}
    </ul>
  </>);
};
export default TrackList;
