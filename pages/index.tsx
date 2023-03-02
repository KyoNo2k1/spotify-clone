import Head from "next/head";
import type { NextPage } from "next";
import SideBar from "../components/SideBar";
import Main from "../components/Main";
import PlaylistContextProvider from "../contexts/PlaylistContext";
import Player from "../components/Player";
import SongContextProvider from "../contexts/SongContext";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <PlaylistContextProvider>
        <SongContextProvider>
          <Head>
            <title>Spotify 2.0</title>
            <meta name="description" content="Spotify by KyoNo1" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/logo.png" />
          </Head>
          <main className="flex ">
            <SideBar />
            <Main />
          </main>
          <div className="sticky bottom-0 text-white">
            <Player />
          </div>
        </SongContextProvider>
      </PlaylistContextProvider>
    </div>
  );
};
export default Home;
