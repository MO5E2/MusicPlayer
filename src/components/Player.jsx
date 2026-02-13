import { useState, useRef, useEffect } from "react";
import NoMoreTalkArtCover from "../assets/NoMoreTalkArtCover.png";
import BlowArtCover from "../assets/BlowArtCover.png";
import DangerousSummerArtCover from "../assets/DangerousSummerArtCover.png";
import OCTANEArtCover from "../assets/OCTANEArtCover.png";
import NoMoreTalk from "../assets/songs/NoMoreTalk.mp3";
import Blow from "../assets/songs/Blow.mp3";
import Rendezvous from "../assets/songs/Rendezvous.mp3";
import Nunidchange from "../assets/songs/Nunidchange.mp3";
import ComeNGo from "../assets/songs/ComeNGo.mp3";
import ShuffleIcon from "../assets/shuffle.png";
import PreviousIcon from "../assets/previous.png";
import PauseIcon from "../assets/pause.png";
import PlayIcon from "../assets/play.png";
import NextIcon from "../assets/next.png";
import RepeatIcon from "../assets/repeat_one.png";
import "./Player.css";

function Player() {
  const playlist = [
    { title: "No morë talk", artist: "Yeat", src: NoMoreTalk, cover: NoMoreTalkArtCover },
    { title: "Blow", artist: "Ke$ha", src: Blow, cover: BlowArtCover },
    { title: "Rendezvous (feat. Yeat)", artist: "Don Toliver", src: Rendezvous, cover: OCTANEArtCover },
    { title: "COMË N GO", artist: "Yeat", src: ComeNGo, cover: DangerousSummerArtCover },
    { title: "Nun id change", artist: "Yeat", src: Nunidchange, cover: NoMoreTalkArtCover },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef(null);

  // Play / Pause
  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Shuffle / Repeat toggles
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  // Next / Previous
  const nextSong = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex && playlist.length > 1);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((currentIndex + 1) % playlist.length);
    }
    setIsPlaying(true);
  };

  const prevSong = () => {
    if (isShuffle) {
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } while (prevIndex === currentIndex && playlist.length > 1);
      setCurrentIndex(prevIndex);
    } else {
      setCurrentIndex(currentIndex === 0 ? playlist.length - 1 : currentIndex - 1);
    }
    setIsPlaying(true);
  };

  // Auto-play on song change
  useEffect(() => {
    if (isPlaying) audioRef.current.play();
  }, [currentIndex]);

  // Auto-play next song when ended
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => nextSong();
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentIndex, isRepeat, isShuffle]);

  // Update progress bar and timestamps
  const handleTimeUpdate = (e) => {
    const audio = e.target;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  // Format time as mm:ss
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div id="player">
      <audio
        ref={audioRef}
        src={playlist[currentIndex].src}
        onTimeUpdate={handleTimeUpdate}
      />

      <img id="art" src={playlist[currentIndex].cover} alt="Album Art" />
      <h1>{playlist[currentIndex].title}</h1>
      <h2>{playlist[currentIndex].artist}</h2>

      <div id="progressBar">
        <div id="progress" style={{ width: `${progress}%` }}></div>
      </div>

      <div id="timestamps">
        <h3 id="start">{formatTime(currentTime)}</h3>
        <h3 id="end">{formatTime(duration)}</h3>
      </div>

      <div id="control">
        <img
          id="shuffle"
          src={ShuffleIcon}
          onClick={toggleShuffle}
          style={{ filter: isShuffle ? "invert(50%) sepia(1) hue-rotate(200deg)" : "invert(100%)" }}
        />
        <img id="previous" src={PreviousIcon} onClick={prevSong} />
        <img id="play" src={isPlaying ? PauseIcon : PlayIcon} onClick={togglePlay} />
        <img id="next" src={NextIcon} onClick={nextSong} />
        <img
          id="repeat"
          src={RepeatIcon}
          onClick={toggleRepeat}
          style={{ filter: isRepeat ? "invert(50%) sepia(1) hue-rotate(200deg)" : "invert(100%)" }}
        />
      </div>
    </div>
  );
}

export default Player;