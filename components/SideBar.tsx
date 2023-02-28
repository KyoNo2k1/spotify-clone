import {
  HomeIcon,
  HeartIcon,
  PlusCircleIcon,
  RssIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import IconButton from "./IconButton";
import { useRouter } from "next/router";
import { usePlaylistContext } from "../contexts/PlaylistContext";
import useSpotify from "../hooks/useSpotify";

const Divider = () => <hr className="border-t-[0.1px] border-gray-400" />;

const SideBar = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const {
    playlistContextState: { playlists },
    updatePlaylistContextState,
  } = usePlaylistContext();

  const handleClickMusic = async (id: string) => {
    const playlistResponse = await spotifyApi.getPlaylist(id);
    updatePlaylistContextState({
      selectedPlaylistId: id,
      selectedPlaylist: playlistResponse.body,
    });
  };

  const router = useRouter();
  return (
    <div className=" scrollbar-hide text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block">
      <div className="space-y-4">
        {session?.user ? (
          <button onClick={() => signOut()}>
            {session.user.name} - Log Out
          </button>
        ) : (
          <button
            className="bg-[#18d860] p-5 rounded-2xl text-black font-bold hover:bg-[#65fea0] "
            onClick={() => router.push("/login")}
          >
            LogIn to see Playlist
          </button>
        )}
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={BuildingLibraryIcon} label="Your Library" />
        <Divider />

        <IconButton icon={PlusCircleIcon} label="Create Playlist" />
        <IconButton icon={HeartIcon} label="Liked Songs" />
        <IconButton icon={RssIcon} label="Your Episodes" />
        <Divider />

        {/*Playlist*/}
        {playlists.map(({ id, name }) => {
          return (
            <p
              key={id}
              className="text-white cursor-pointer hover:text-white"
              onClick={() => handleClickMusic(id)}
            >
              {name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
