import { useEffect, useState } from 'react';
import './App.css';
import TrackManager from './TrackManager';
function App() {
  useEffect(()=>{const tag  = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);  
      }});
  return (
    <div className="App">
      <TrackManager/>
    </div>
  );
}

export default App;
