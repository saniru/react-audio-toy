import { useEffect } from "react";
import { AudioTrack, FileTrack, TrackSerialization, YouTubeTrack } from "./AudioTrack";
import  FileInput  from "./FileInput";
import  URLInput  from "./URLInput";
const createPlayerDummy = async (url: string) => {
  while(!window.hasOwnProperty("YT")){
      await new Promise(resolve => setTimeout(resolve,1000));
    }
  return new Promise((resolve,_)=>{
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
    //@ts-expect-error
    new YT.Player(div.id, { videoId: url, playerVars: options, events });
    document.getElementById(div.id)!.hidden = true;
    function onPlayerReady(event: any) {
      resolve(event.target);
    }
  });
};
const handleYoutube = async (url: URL, params? : TrackSerialization) => {
  const player = await createPlayerDummy(url.searchParams.get("v") as string);
  const yt = new YouTubeTrack(player);
  if (params) {
    yt.CreateDate = params.createDate;
    yt.delay = params.delay;
    yt.setVolume(params.volume);
    yt.playing = params.playing;
    yt.id = yt.name + "_" + yt.CreateDate;
  }
  return yt;
};
const handleFile = async (f: File) => {
  return new Promise((resolve,reject) =>{
      const reader = new FileReader();
      reader.onload = () => {
        const atag = new Audio();
        atag.src = reader.result as string;
        atag.addEventListener("loadeddata", () => {
          resolve (new FileTrack(atag, f.name));
        });
      };
  reader.onerror = reject;
    reader.readAsDataURL(f);
  });
};
const handleDataURL = async (e:TrackSerialization) => {
  return new Promise ((resolve,_) =>{
    const atag = new Audio();
    atag.src = e.data.toString();
    atag.addEventListener("loadeddata", () => {
      const track = new FileTrack(atag,e.name);
      track.CreateDate = e.createDate;
      track.delay = e.delay;
      track.setVolume(e.volume);
      track.playing = e.playing;
      track.id = track.name + "_" + track.CreateDate;
      resolve(track);
    });
  });
};
function AddTracks(props: {dispatch:Function}){
  const getFile = async (f: FileList) => {
    const ff  = await Promise.all([...f].map(async f => {
      return await handleFile(f);
    }));
    props.dispatch({type:"add",payload:{track:ff as AudioTrack[]}});
  };
  const getValue = async (val: string) => {
    try {
      const url = new URL(val);
      const yt = await handleYoutube(url);
      props.dispatch({type:"add",payload:{track:[yt]}});
    }
    catch (e) {
    }
  };
  useEffect(() => {
    const loadAudios = async() =>{
      const tracks = localStorage.getItem("tracklist");
      if (!tracks) {return;}
      const adds : TrackSerialization[] = JSON.parse(tracks);
      const youtubes = await Promise.all(adds
          .filter((e : TrackSerialization) => e.type == "Youtube")
                                         .map(async e => {return await handleYoutube(new URL(e.data),e)}));
    const files = await Promise.all(adds
           .filter((e : TrackSerialization) => e.type == "File")
           .map(async e => {
             return await handleDataURL(e);
           }
               ));
      props.dispatch({type:"add",payload:{track:files}});
      props.dispatch({type:"add",payload:{track:youtubes}});
    };
    loadAudios();

  },[]);
  return (<><URLInput callback={getValue} /><FileInput callback={getFile} /></>);
}

export default AddTracks;
