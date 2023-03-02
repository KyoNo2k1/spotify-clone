import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePlaylistContext } from "../contexts/PlaylistContext";
import UserIcon from "../assets/userImg.png";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { pickRandom } from "../utils/pickRandom";
import NoImgPlaylist from "../assets/noImgPlaylist.png";
import Songs from "./Songs";

const colors = [
  "from-indigo-400",
  "from-green-400",
  "from-sky-300",
  "from-pink-400",
  "from-orange-400",
  "from-emerald-400",
  "from-teal-400",
  "from-rose-400",
  "from-amber-400",
];

const Main = () => {
  const {
    playlistContextState: { selectedPlaylist, selectedPlaylistId },
  } = usePlaylistContext();

  const { data: session } = useSession();

  const [fromColor, setFromColor] = useState<string | null>(null);

  useEffect(() => {
    setFromColor(pickRandom(colors));
  }, [selectedPlaylistId]);

  return (
    <div className="from-r scrollbar-hide text-white flex-grow relative h-screen overflow-y-scroll ">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2"
          onClick={() => {
            signOut();
          }}
        >
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Image"
            height={30}
            width={30}
            className="bg-slate-300 rounded-full object-cover"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="icon" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${fromColor} to-blue-400 h-80 p-8`}
      >
        {selectedPlaylist && (
          <>
            <Image
              src={selectedPlaylist.images[0]?.url || NoImgPlaylist}
              alt="Playlist Image"
              height={176}
              width={176}
              className="shadow-2xl"
            />
            <div>
              <p>Playlist</p>
              <h1 className="text-xl font-bold md:text-3xl xl:text-4xl">
                {selectedPlaylist.name}
              </h1>
            </div>
          </>
        )}
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Main;
