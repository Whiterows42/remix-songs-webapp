"use client"
import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, Play, Pause, Heart, Volume2, SkipBack, SkipForward, Volume1, VolumeX } from "lucide-react";
import { useSelector } from "react-redux";
import { selectActiveCategory } from "@/redux/slices/songSlice";

const MusicPlatform = () => {
  const [activeSong, setActiveSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState([]);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const progressRef = useRef(null);
  const activeCategory = useSelector(selectActiveCategory)
  useEffect(() => {
    async function fetchd() {
      const response = await fetch("/api/songs");
      const data = await response.json();
      setSongs(data.data);
    }
    fetchd();
  }, []);

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.addEventListener('timeupdate', updateProgress);
      audioPlayer.addEventListener('loadedmetadata', () => {
        setDuration(audioPlayer.duration);
      });
      audioPlayer.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
    return () => {
      if (audioPlayer) {
        audioPlayer.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [audioPlayer]);

  const updateProgress = () => {
    setCurrentTime(audioPlayer.currentTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSongClick = (songId, songUrl) => {
    if (activeSong === songId) {
      if (isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioPlayer) {
        audioPlayer.pause();
      }
      const newAudioPlayer = new Audio(songUrl);
      newAudioPlayer.volume = volume;
      newAudioPlayer.play();
      setAudioPlayer(newAudioPlayer);
      setActiveSong(songId);
      setIsPlaying(true);
    }
  };
console.log("sf",activeCategory);
  const handleProgressClick = (e) => {
    if (!audioPlayer) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioPlayer.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (audioPlayer) {
      if (volume === 0) {
        audioPlayer.volume = prevVolume;
        setVolume(prevVolume);
      } else {
        setPrevVolume(volume);
        audioPlayer.volume = 0;
        setVolume(0);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume;
    }
  };

  const filteredSongs = activeCategory === "All"
    ? songs
    : songs.filter((song) => song.category === activeCategory);

  const activeSongData = songs.find(song => song._id === activeSong);

  return (
    <div className="flex flex-col  bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative">
    {/* Main Content */}
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-8 bg-gradient-to-b from-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black scrollbar-none pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row py-2 sticky top-1 z-20 backdrop-blur-sm items-start sm:items-center justify-between mb-4 sm:mb-8 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">{activeCategory}</h2>
        <button className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center">
          See All <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        {filteredSongs.map((song) => (
          <div
            key={song._id}
            className={`flex items-center h-full overflow-x-hidden justify-between p-2 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all
              ${activeSong === song._id ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            onClick={() => handleSongClick(song._id, song.url)}
          >
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song._id, song.url);
                }}
              >
                {activeSong === song._id && isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base truncate w-1/2 overflow-ellipsis">{song.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">Audio</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                className="text-gray-400 hover:text-purple-500 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <span className="text-gray-400 min-w-[60px] text-right text-xs sm:text-sm">
                {(song.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Player Bar */}
    {activeSong && (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-2 sm:p-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="h-1 bg-gray-700 rounded-full mb-2 sm:mb-4 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm sm:text-base truncate">{activeSongData?.name}</h4>
              <p className="text-xs sm:text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors"
                onClick={() => handleSongClick(activeSong, activeSongData?.url)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
                <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="relative flex items-center gap-2">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                  toggleMute();
                  setShowVolume(!showVolume);
                }}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : volume < 0.5 ? (
                  <Volume1 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 accent-purple-500 hidden sm:block"
              />
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default MusicPlatform;