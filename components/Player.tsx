import {
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ChangeEventHandler } from "react";
import { useSongContext } from "../contexts/SongContext";
import useSpotify from "../hooks/useSpotify";
import { SongReducerActionType } from "../types";
import { useDebouncedCallback } from "use-debounce";

const Player = () => {
  const spotifyApi = useSpotify();

  const {
    dispatchSongAction,
    songContextState: { isPlaying, selectedSong, deviceId, volume },
  } = useSongContext();

  const handlePlayPause = async () => {
    const response = await spotifyApi.getMyCurrentPlaybackState();

    if (!response.body) return;

    if (response.body.is_playing) {
      await spotifyApi.pause();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: false,
      });
    } else {
      await spotifyApi.play();
      dispatchSongAction({
        type: SongReducerActionType.ToggleIsPlaying,
        payload: true,
      });
    }
  };

  //backward
  const handleSkipSong = async (skipTo: "previous" | "next") => {
    if (!deviceId) return;
    if (skipTo === "previous") await spotifyApi.skipToPrevious();
    else await spotifyApi.skipToNext();

    const songInfo = await spotifyApi.getMyCurrentPlayingTrack();

    if (!songInfo.body) return;
    dispatchSongAction({
      type: SongReducerActionType.SetCurrentPlayingSong,
      payload: {
        selectedSongId: songInfo.body.item?.id,
        selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
        isPlaying: songInfo.body.is_playing,
      },
    });
  };
  //volumn
  const debouncedVolume = useDebouncedCallback((volume: number) => {
    spotifyApi.setVolume(volume);
  }, 300);
  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = Number(event.target.value);

    if (!deviceId) return;
    debouncedVolume(volume);

    dispatchSongAction({
      type: SongReducerActionType.SetVolume,
      payload: volume,
    });
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/*Left*/}
      <div className="flex items-center space-x-4">
        {selectedSong ? (
          <>
            <div className="hidden md:block">
              <Image
                src={selectedSong.album.images[0].url}
                alt={`Album cover for ${selectedSong.name}`}
                height={40}
                width={40}
              />
            </div>
            <div>
              <h3>{selectedSong.name}</h3>
              <p>{selectedSong.artists[0].name}</p>
            </div>
          </>
        ) : (
          "Choose song to playing"
        )}
      </div>
      {/*Middle*/}
      <div className="flex justify-evenly items-center">
        <ArrowsRightLeftIcon className="icon-playback" />
        <BackwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "previous")}
        />
        {isPlaying ? (
          <PauseCircleIcon
            className="icon-playback"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayCircleIcon className="icon-playback" onClick={handlePlayPause} />
        )}
        <ForwardIcon
          className="icon-playback"
          onClick={handleSkipSong.bind(this, "next")}
        />
        <ArrowPathRoundedSquareIcon className="icon-playback" />
      </div>
      {/*Right*/}
      <div className="flex justify-end items-center pr-5 space-x-3 md:space-x-4">
        <MusicalNoteIcon className="icon-playback" />
        <input
          type="range"
          min={0}
          max={100}
          className="w-20 md:w-auto accent-blue-400"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default Player;
