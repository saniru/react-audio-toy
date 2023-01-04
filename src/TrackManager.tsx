import { useReducer } from 'react';
import { AudioTrack } from './AudioTrack';
import  TrackList  from './TrackList';
import AddTracks from './AddTracks';

interface TrackAction{
  type:string;
  payload:{track?:AudioTrack[],val?:any,id?:string};
}
function reducer (state: AudioTrack[], action:TrackAction) : any[]{
  switch (action.type) {
  case 'add':
    return [...state,...action.payload.track as AudioTrack[]];
  case 'delay':
    return state.map((el: AudioTrack) => el.id === action.payload.id ? { ...el, delay: action.payload.val } : el); 
  case 'playing':
    return state.map((el: AudioTrack) => el.id === action.payload.id ? { ...el, playing: !el.playing } : el);
  case 'volume':
    const newtracklist: AudioTrack[] = [];
    for (let track of state) {
      if (track.id === action.payload.id) {
        const newtrack = track;
        newtrack.setVolume(action.payload.val);
        newtracklist.push(newtrack);
      }
      else{
        newtracklist.push(track);
      }
    }
    return newtracklist;
  default:
    return state;
  }
};
function TrackManager(){
  const [state,dispatch] = useReducer(reducer,[]);
  const playTrack  = (t : string) => {
    for (let track  of state) {
      if (track.id === t) {
        track.play();
      }
    }

  };

  return (
      <div>
        <div>
    <TrackList dispatch={dispatch} tracks={state} playTrack={playTrack}/>
    </div>
    <AddTracks dispatch={dispatch}/>
      </div>
    );
}
/*export class TrackManager extends Component {
  // changeVolume = (t: AudioTrack, val: number) => {
  //   const newtracklist: AudioTrack[] = [];
  //   for (let track of this.state.tracklist) {
  //     if (track === t) {
  //       const newtrack = t;
  //       t.setVolume(val);
  //       newtracklist.push(newtrack);
  //     }
  //     else{
  //       newtracklist.push(track);
  //     }
  //   }
  //   this.setState((prevState:any) =>({tracklist:newtracklist}));
  // };
  // changeDelay = (t: AudioTrack, val: number) => {
  //   this.setState((prevState: any) => ({
  //     tracklist: prevState.tracklist.map(
  //       (el: AudioTrack) => el === t ? { ...el, delay: val } : el
  //     )
  //   }))
  // };
  // changePlaying = (t: AudioTrack, val: boolean) => {
  //   this.setState((prevState: any) => ({
  //     tracklist: prevState.tracklist.map(
  //       (el: AudioTrack) => el === t ? { ...el, playing: val } : el
  //     )
  //   }))
  // };
}
*/
export default TrackManager;
