import { AudioTrack } from "./AudioTrack";
import { Track } from "./Track";

function TrackList(props:{dispatch:Function,tracks:AudioTrack[],playTrack:Function}){
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
                       TrackType={e.TrackType}/>)}
            </ul>
          </>);
};
export default TrackList;
