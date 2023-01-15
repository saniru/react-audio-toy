let audioBase: AudioContext | null = null;
type TrackTypes = "File"|"Youtube"
interface TrackSerialization {
  type: TrackTypes;
  data: string;
  name: string;
  createDate: number;
  delay: number;
  volume: number;
  playing: boolean;
}
abstract class AudioTrack {
  CreateDate: number;
  constructor() {
    this.playing = true;
    this.CreateDate = Date.now();
  }
  abstract setVolume: Function;
  abstract getVolume: Function;
  abstract delay: number;
  abstract name: string;
  abstract TrackType: TrackTypes;
  playing: boolean;
  abstract duration: number;
  abstract play(): void;
  abstract pause(): void;
  abstract id: string;
}
class FileTrack extends AudioTrack {
  AudioTag: HTMLAudioElement;
  delay: number;
  duration: number;
  name: string;
  TrackType: TrackTypes;
  id: string;
  AudioNode: MediaElementAudioSourceNode;
  gainNode: GainNode;
  constructor(AudioTag: HTMLAudioElement, name: string) {
    super();
    this.name = name;
    this.TrackType = "File";
    this.AudioTag = AudioTag;
    this.delay = 10000;
    this.duration = AudioTag.duration;
    if (!audioBase) {
      audioBase = new AudioContext({ latencyHint: "playback" });
    }
    this.AudioNode = audioBase.createMediaElementSource(AudioTag);
    this.gainNode = audioBase.createGain();
    this.AudioNode.connect(this.gainNode).connect(audioBase.destination);
    this.gainNode.gain.setValueAtTime(0.5, audioBase.currentTime);
    this.id = this.name + "_" + this.CreateDate;
  }
  getVolume = () => this.gainNode.gain.value;
  setVolume = (val: number) => {
    if (!audioBase) { return; }
    try {
      this.gainNode.gain.setValueAtTime(val / 100, audioBase.currentTime);
    }
    catch (e) {
      console.warn(`val=${val}`);
    }
  }
  play = () => {
    this.AudioNode.mediaElement.play();
  }
  pause = () => {
    this.AudioTag.pause();
  }
}
class YouTubeTrack extends AudioTrack {
  playerNode: YT.Player;
  volume: number;
  delay: number;
  duration: number;
  name: string;
  id: string;
  TrackType: TrackTypes;
  constructor(player: any) {
    super();
    this.playerNode = player;
    this.name = player.getVideoData().title;
    this.TrackType = "Youtube";
    this.delay = 1000;
    this.duration = this.playerNode.getDuration();
    this.volume = 100;
    this.playerNode.setVolume(this.volume);
    this.id = this.name + "_" + this.CreateDate;
  }
  getVolume = () => this.playerNode.getVolume();
  setVolume = (val: number) => {
    this.playerNode.setVolume(val);
  }
  play = () => {
    this.playerNode.playVideo();
  }
  pause = () => {
    this.playerNode.pauseVideo();
  }
}
export type { TrackSerialization }
export { FileTrack, YouTubeTrack, AudioTrack }
