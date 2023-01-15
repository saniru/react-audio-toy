import { useEffect, useReducer } from 'react';
import { AudioTrack, TrackSerialization } from './AudioTrack';
import TrackList from './TrackList';
import AddTracks from './AddTracks';

interface TrackAction {
  type: string;
  payload: { track?: AudioTrack[], val?: any, id?: string };
}
function uniqueTracks(tracks: AudioTrack[]) {
  const map = new Map();
  tracks.forEach(e => {
    map.set(e.id, e);
  });
  return [...map.values()];
}
function reducer(state: AudioTrack[], action: TrackAction): any[] {
  switch (action.type) {
    case 'add':
      return [...state, ...uniqueTracks(action.payload.track as AudioTrack[])];
    case 'remove':
      return state.filter((e) => e.id != action.payload.id);
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
        else {
          newtracklist.push(track);
        }
      }
      return newtracklist;
    default:
      return state;
  }
};
function serializeTrack(e: AudioTrack): TrackSerialization {
  return {
    type: e.TrackType,
    data: e.AudioTag?.src ?? e.playerNode.getVideoUrl(),
    name: e.name,
    createDate: e.CreateDate,
    delay: e.delay,
    volume: e.getVolume(),
    playing: e.playing
  };
}
function TrackManager() {
  const [state, dispatch] = useReducer(reducer, []);
  useEffect(() => {
    const tracks = state.map(e => serializeTrack(e));
    localStorage.setItem('tracklist', JSON.stringify(tracks));
  }, [state]);
  const playTrack = (t: string) => {
    for (let track of state) {
      if (track.id === t) {
        track.play();
      }
    }

  };

  return (
    <div>
      <TrackList dispatch={dispatch} tracks={state} playTrack={playTrack} />
      <AddTracks dispatch={dispatch} />
    </div>
  );
}
export default TrackManager;
