import { useRef, useState, useEffect, useCallback } from "react";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdOutlineRectangle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import Toggle from "react-toggle";
import "react-toggle/style.css";

const VideoPlayer = ({ src, defaultSrc, playNext }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState();
  const [duration, setDuration] = useState([0, 0]);
  const [durationSeconds, setDurationSeconds] = useState();
  const [playbackSettingsOpen, setPlaybackSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoplay, setAutoplay] = useState(false);

  const secondsToMinutes = (sec) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: secRemain,
    };
  };

  const initializeVideo = useCallback(() => {
    setInterval(() => {
      const { min, sec } = secondsToMinutes(videoRef.current.currentTime);
      setCurrentTime([min, sec]);
      setCurrentTimeSeconds(videoRef.current.currentTime);
    }, 10);

    if (src === null) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }

    videoRef.current.play();
    const { min, sec } = secondsToMinutes(videoRef.current.duration);
    setDurationSeconds(videoRef.current.duration);
    setDuration([min, sec]);
  }, [src]);

  useEffect(() => {
    initializeVideo();
  }, [initializeVideo]);

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const enterFullScreen = (e) => {
    e.stopPropagation();
    if (videoRef.current.requestFullScreen) {
      videoRef.current.requestFullScreen();
    } else if (videoRef.current.webkitRequestFullScreen) {
      videoRef.current.webkitRequestFullScreen();
    } else if (videoRef.current.msRequestFullScreen) {
      videoRef.current.msRequestFullScreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    }
  };

  const handlePlaybackSpeed = (e, speed) => {
    e.stopPropagation();
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setPlaybackSettingsOpen(false);
  };

  const seekBackward = (e) => {
    e.stopPropagation();
    videoRef.current.currentTime -= 10;
  };

  const seekForward = (e) => {
    e.stopPropagation();
    videoRef.current.currentTime += 10;
  };

  return (
    <div className="flex">
      <div className="flex flex-col" onClick={handlePlay}>
        <video
          controls={false}
          ref={videoRef}
          src={src === null ? defaultSrc : src}
          className="w-full h-full md:h-4/5 -z-10"
          onCanPlayThrough={initializeVideo}
          style={{ backgroundColor: "black" }}
          onEnded={autoplay ? playNext : null}
        ></video>
        <div className="-my-[3em] text-white w-full px-2 relative">
          <div className="flex items-center gap-2 z-10 justify-between">
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <FaPause onClick={handlePlay} className="cursor-pointer" />
              ) : (
                <FaPlay onClick={handlePlay} className="cursor-pointer" />
              )}
              <div>
                {currentTime[0]}:{currentTime[1]} / {duration[0]}:{duration[1]}
              </div>
              <RxDoubleArrowLeft
                onClick={(e) => seekBackward(e)}
                className="cursor-pointer"
              />
              <RxDoubleArrowRight
                onClick={(e) => seekForward(e)}
                className="cursor-pointer"
              />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Toggle
                className="mx-2"
                checked={autoplay}
                onChange={() => {
                  setAutoplay((autoplay) => !autoplay);
                }}
              />
              <IoSettingsSharp
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaybackSettingsOpen(
                    (playbackSettings) => !playbackSettings
                  );
                }}
              />
              <MdOutlineRectangle className="mx-2" onClick={enterFullScreen} />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={durationSeconds}
            default="0"
            value={currentTimeSeconds}
            className="w-full"
            onChange={(e) => {
              videoRef.current.currentTime = e.target.value;
            }}
          />
          {playbackSettingsOpen ? (
            <div className="absolute text-black right-10 bottom-16 bg-slate-100 flex flex-col rounded-md cursor-pointer z-20">
              <span
                className={`${
                  playbackSpeed === 1.5 ? "bg-slate-200" : ""
                } px-8 py-1`}
                onClick={(e) => handlePlaybackSpeed(e, 1.5)}
              >
                1.5x
              </span>
              <span
                className={`${
                  playbackSpeed === 1 ? "bg-slate-200" : ""
                } px-8 py-1`}
                onClick={(e) => handlePlaybackSpeed(e, 1)}
              >
                1x
              </span>
              <span
                className={`${
                  playbackSpeed === 0.5 ? "bg-slate-200" : ""
                } px-8 py-1`}
                onClick={(e) => handlePlaybackSpeed(e, 0.5)}
              >
                0.5x
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
