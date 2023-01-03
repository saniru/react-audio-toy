abstract class AudioTrack{
  CreateDate:number;
  constructor() {
    this.playing = false;
    this.CreateDate = Date.now();
  }
  abstract set volume(val:number)
  abstract get volume() : number
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
  constructor(AudioTag:HTMLAudioElement,name:string) {
    super();
    this.name = name;
    this.TrackType = "File";
    this.AudioTag = AudioTag;
    this.delay = 0;
    this.duration = AudioTag.duration;
  }
  set volume(val: number) {
    this.AudioTag.volume = val;
  }
  get volume(): number {
    return this.AudioTag.volume;
  }
  play(){
    this.AudioTag.play();
  }
  pause(){
    this.AudioTag.pause();
  }
  
}
class YouTubeTrack extends AudioTrack {
  playerNode: any;
  delay:number;
  duration:number;
  name:string;
  TrackType:string;
  constructor(player : any) {
    super();
    this.playerNode = player;
    this.name = player.getVideoData().title;
    this.TrackType = "Youtube";
    this.delay = 0;
    this.duration = this.playerNode.getDuration();
  }
  set volume(val: number) {
    this.playerNode.setVolume(val);
  }
  get volume(): number {
    return this.playerNode.getVolume();
  }
  play(): void {
    this.playerNode.playVideo();
  }
  pause(): void {
    this.playerNode.playVideo();
  }
}
export{FileTrack,YouTubeTrack,AudioTrack}
