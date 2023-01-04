import { AudioTrack, FileTrack, YouTubeTrack } from "./AudioTrack";
import  FileInput  from "./FileInput";
import  URLInput  from "./URLInput";
const createPlayerDummy = (url: string) => {
  return new Promise((resolve, _) => {
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
  }
                    );
};
const handleYoutube = async (url: URL) => {
  const player = await createPlayerDummy(url.searchParams.get("v") as string);
  return new YouTubeTrack(player);
};
const handleFile = async (f: File) => {
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
  return (<><URLInput callback={getValue} /><FileInput callback={getFile} /></>);
}

export default AddTracks;
