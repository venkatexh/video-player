import VideoPlayer from "@/components/VideoPlayer";
import PlayList from "@/components/PlayList";
import { videosList } from "@/data/videos";
import { useState } from "react";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [videos, _] = useState(videosList);

  const playNext = () => {
    const idx =
      nowPlaying === null
        ? 0
        : videos.findIndex((video) => video.source === nowPlaying);
    console.log(idx);
    setNowPlaying(videos[idx + 1].source);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-3/4">
        <VideoPlayer
          src={nowPlaying}
          defaultSrc={videos[0].source}
          playNext={playNext}
        />
      </div>
      <div className="w-full md:w-1/4">
        <PlayList
          list={videos}
          current={nowPlaying === null ? videos[0].source : nowPlaying}
          setPlaying={(video) => setNowPlaying(video)}
        />
      </div>
    </div>
  );
}
