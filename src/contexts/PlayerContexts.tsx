import { is } from 'date-fns/locale';
import { match } from 'node:assert';
import { createContext, useState, ReactNode, useContext  } from 'react';
import { Player } from '../componentes/player';

type Episode ={
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type  PlayerContextData ={
    episodeList: Episode[],
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;

    play: (episode: Episode) => void;
    PlayList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    PlayNext: () => void;
    PlayPreviuos: () => void;
    SetPlayingState: (state: boolean) => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

type PlayerContextProvidProps ={
    children: ReactNode;
}
export const  PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvid({ children }: PlayerContextProvidProps) {
    const  [ episodeList, SetEpisodeList ] = useState([])
    const [currentEpisodeIndex, SetCurrentEpisodeIndex ] = useState(0);
    const [isPlaying, SetIsPlaying] = useState(false)
    const [isLooping, SetIsLooping] = useState(false)
    const [isShuffling, SetIsShuffling] = useState(false)


  
      function play(episode: Episode) {
        SetEpisodeList([episode])
        SetCurrentEpisodeIndex(0)
        SetIsPlaying(true);
  
      }

      function PlayList(list: Episode[], index: number) {
          SetEpisodeList(list)
          SetCurrentEpisodeIndex(index)
          SetIsPlaying(true);

      }
  
      function togglePlay() {
        SetIsPlaying(!isPlaying);
      }
      function toggleLoop() {
        SetIsLooping(!isLooping);
      }

      function toggleShuffle() {
        SetIsShuffling(!isShuffling);
      }
  
      function SetPlayingState(state: boolean) {
        SetIsPlaying(state)
      }
      const hasPrevious = currentEpisodeIndex > 0;
      const hasNext = (currentEpisodeIndex + 1)< episodeList.length;

      function PlayNext() {

        if(isShuffling){
            const nextRandomEPisodeIndex = Math.floor(Math.random() * episodeList.length)
            SetCurrentEpisodeIndex(nextRandomEPisodeIndex);
        }
        else if (hasNext){
            SetCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
      }

      function PlayPreviuos() {
          if (hasPrevious){
              SetCurrentEpisodeIndex(currentEpisodeIndex -1)
          }
      }
     return(
        <PlayerContext.Provider
            value={{
                 episodeList,
                currentEpisodeIndex, 
                play,
                PlayList,
                isPlaying,
                PlayNext,
                PlayPreviuos,
                togglePlay, 
                isLooping,
                isShuffling,
                SetPlayingState,
                hasNext,
                hasPrevious,
                toggleLoop,
                toggleShuffle,
            }}
        >
            { children }
        </PlayerContext.Provider>
     );
}

export const usePlayer = () =>{
    return useContext(PlayerContext)
}