import { FaRegPlayCircle } from "react-icons/fa";
import { useState } from "react";
import Reorder, { reorder } from "react-reorder";

const PlayList = ({ list, setPlaying, current }) => {
  const [playlist, setPlaylist] = useState(list);
  const [searchTerm, setSearchTerm] = useState("");
  const getFilteredList = playlist.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onReorder = (e, fromId, toId) => {
    setPlaylist(reorder(playlist, fromId, toId));
  };

  return (
    <div className="h-screen bg-slate-100">
      <div className="bg-slate-100 h-[80px] border-b border-slate-300 px-4 py-2">
        <div className="text-xl font-semibold">List of videos</div>
        <input
          className="px-2 my-1 rounded-md focus:outline-none"
          placeholder="Search for a video"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col max-h-[calc(100%-80px)] overflow-y-auto">
        <Reorder reorderId="playlist" autoScroll onReorder={onReorder}>
          {getFilteredList.map((video) => {
            return (
              <div
                className={`${
                  current === video.source ? "bg-slate-200" : "bg-slate-100"
                }  border-b border-slate-300 p-4 text-lg font-medium flex items-center gap-2 cursor-pointer`}
                key={video.title}
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaying(video.source);
                }}
              >
                <FaRegPlayCircle />
                {video.title}
              </div>
            );
          })}
        </Reorder>
      </div>
    </div>
  );
};

export default PlayList;
