import { useContext, useRef , useEffect, useState} from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContexts';
import  styles from './styles.module.scss' ;
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ConvertDurationToString } from '../../utils/ConvertDurationToString';


export  function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress , SetProgress] = useState(0)
    const {episodeList,
         currentEpisodeIndex ,
          isPlaying,
          isLooping,
          isShuffling,
          toggleLoop,
           togglePlay,
           toggleShuffle,
           SetPlayingState,
           PlayPreviuos,
           PlayNext,
           hasNext,
           hasPrevious,
        } = usePlayer();

    const episode = episodeList[currentEpisodeIndex]
    useEffect(()=>{
        if (!audioRef.current ){
            return;
        }
        if (isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()

        }
    },[isPlaying])

    function SetupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () =>{
            SetProgress( Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        SetProgress(amount)
    }


    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="tocando agora"/>
                <strong>Tocando Agora </strong>
            </header>
                { episode ? (
                    <div className={styles.currentEpisode}>
                        < Image
                            width={592} 
                            height={592}
                            src={episode.thumbnail}
                            objectFit="cover"
                         />
                         <strong>{episode.title}</strong>
                         <strong>{episode.members}</strong>

                    </div>
                 )   
                :   (
                    <div className={styles.empatyPlayer}>
                    <strong>Selecione algo para ouvir</strong>
                </div>
                )}
          
            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>{ConvertDurationToString(progress)}</span>
                    <div className={styles.slider}>
                       {episode ? (
                           <Slider 
                                max ={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor:  '#0d361'}}
                                railStyle={{  backgroundColor: '#9f75ff' }} 
                                handleStyle={{ borderColor:  '#0d361',  borderWidth: 4 }}
                            />
                        ) : (
                        <div className={styles.empatySlider} />
                       )}
                    </div>
                    <span>{ConvertDurationToString(episode ?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio  
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onPlay={()=> SetPlayingState(true)}
                        onPause={()=>SetPlayingState(false)}
                        onLoadedMetadata={SetupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length == 1}
                        onClick={toggleShuffle}
                        className={  isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={PlayPreviuos} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="tocar anterior"/>
                    </button>
                    <button 
                    type="button" 
                    className={styles.playButton}
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        {  isPlaying
                         ?   <img src="/pause.svg" alt="tocar"/> 
                         :   <img src="/play.svg" alt="tocar" /> }
                        
                    </button>
                    <button type="button" onClick={PlayNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar proxima"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop} className={toggleLoop ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}