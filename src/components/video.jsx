// src/components/Video.js
import React from 'react';
import './Video.css'; 
import videoSource from '../assets/Blue Minimalist Aesthetic City4 Building Scenery Travel Vlog Thumbnail Youtube Intro.mp4';

const Video = () => {
  return (
    <div className="video-background-container">
      <video className="video-background" autoPlay muted loop>
        <source src={videoSource} type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
      {/* <div className="search-bar">
        <input type="text" placeholder="Explorez..." />
      </div> */}
    </div>
  );
};

export default Video;
