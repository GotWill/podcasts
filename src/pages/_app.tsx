import  '../styles/global.scss';
import { Header } from '../componentes/Header'
import { Player } from '../componentes/player';
import { useState } from 'react';

import styles from '../styles/app.module.scss';
import { PlayerContext } from '../contexts/PlayerContexts';


function MyApp({ Component, pageProps }) {
  const  [ episodeList, SetEpisodeList ] = useState([])
  const [currentEpisodeIndex, SetCurrentEpisodeIndex ] = useState(0);
  const [isPlaying, SetIsPlaying] = useState(false)

    function play(episode) {
      SetEpisodeList([episode])
      SetCurrentEpisodeIndex(0)
      SetIsPlaying(true);

    }

    function togglePlay() {
      SetIsPlaying(!isPlaying);
    }

    function SetPlayingState(state: boolean) {
      SetIsPlaying(state)
    }
   return(
<PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, SetPlayingState}}>
          <div className={styles.wrapper}>
          <main>
            <Header/>
            <Component  {...pageProps}/>
          </main>
          < Player />
        </div>
      </PlayerContext.Provider >
    );
  }

export default MyApp
