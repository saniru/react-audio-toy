let audioBase: AudioContext | null = null;
abstract class AudioTrack{
  CreateDate:number;
  constructor() {
    this.playing = true;
    this.CreateDate = Date.now();
  }
  abstract setVolume:Function;
  abstract getVolume:Function;
  abstract delay:number;
  abstract name:string;
  abstract TrackType:string;
  playing: boolean;
  abstract duration:number;
  abstract play() : void;
  abstract pause() : void;
}
class FileTrack extends AudioTrack {
  AudioTag:HTMLAudioElement;
  delay:number;
  duration:number;
  name:string;
  TrackType:string;
  AudioNode: MediaElementAudioSourceNode;
  gainNode: GainNode;
  constructor(AudioTag:HTMLAudioElement,name:string) {
    super();
    this.name = name;
    this.TrackType = "File";
    this.AudioTag = AudioTag;
    this.delay = 10000;
    this.duration = AudioTag.duration;
    if (!audioBase) {
      audioBase = new AudioContext({latencyHint:"playback"});
    }
    this.AudioNode = audioBase.createMediaElementSource(AudioTag);
    this.gainNode = audioBase.createGain();
    this.AudioNode.connect(this.gainNode).connect(audioBase.destination);
    this.gainNode.gain.setValueAtTime(0.5,audioBase.currentTime);
  }
  getVolume = () => this.gainNode.gain;
  setVolume = (val:number) =>{
    if(!audioBase){return;}
    this.gainNode.gain.setValueAtTime(val/100,audioBase.currentTime);
  }
  play =()=>{
    this.AudioNode.mediaElement.play();
  }
  pause=()=>{
    this.AudioTag.pause();
  }
  
}
class YouTubeTrack extends AudioTrack {
  playerNode: any;
  volume:number;
  delay:number;
  duration:number;
  name:string;
  TrackType:string;
  constructor(player : any) {
    super();
    this.playerNode = player;
    this.name = player.getVideoData().title;
    this.TrackType = "Youtube";
    this.delay = 1000;
    this.duration = this.playerNode.getDuration();
    this.volume = 100;
    this.playerNode.setVolume(this.volume);
  }
  getVolume = () => this.playerNode.getVolume();
  setVolume = (val:number) =>{
    this.playerNode.setVolume(val);
  }
  play = () =>{
    this.playerNode.playVideo();
  }
  pause = () => {
    this.playerNode.pauseVideo();
  }
}
export{FileTrack,YouTubeTrack,AudioTrack}
