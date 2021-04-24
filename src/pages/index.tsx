import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../contexts/PlayerContexts';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { ptBR } from 'date-fns/locale';
import { ConvertDurationToString } from '../utils/ConvertDurationToString';
import  styles from './home.module.scss';
 
type Episode ={
  id: string;
  title: string;
  members: string;
  published_at: string;
  duration: number;
  thumbnail: string;
  durattionAsString: string;
  url: string;
}

type HomeProps ={
  LatesEpisodes :Episode[];
   AllEpisodes: Episode[];
}

export  default function Home( { LatesEpisodes, AllEpisodes }: HomeProps) {
  const {PlayList} = usePlayer();
  const episodeList = [... LatesEpisodes,...AllEpisodes]
  return (
    <div className={styles.homepage}>
          <section className={styles.latestEpisodes}>
              <h2>Ultimos Lancamnetos </h2>
              <ul>
                {LatesEpisodes.map((episode, index )=>{
                  return(
                    <li key={episode.id}> 
                      <Image
                       width={192} 
                       height={192} 
                       src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover" />
                      <div className={styles.episodeDetails}>
                        < Link  href={`/episodes/${episode.id}`} >
                         <a>{episode.title}</a>
                        </Link>
                        <p>{episode.members}</p>
                        <span>{episode.published_at}</span>
                        <span>{episode.durattionAsString}</span>
                      </div>
                        <button type="button" onClick={() => PlayList(episodeList, index) }>
                          <img src="/play-green.svg" alt="tocar episodio"/>
                        </button>
                    </li>
                  )
                })}
              </ul>
         </section>

           <section className={styles.allEpisodes}>
                  <h2>Todos episodios</h2>

                  <table cellSpacing={0}> 
                    <thead>
                      <tr>
                        <th></th>
                        <th>Podcast</th>
                        <th>Integrantres</th>
                        <th>Data</th>
                        <th>Duracão</th>
                        <th></th>   
                     </tr>                   
                    </thead>
                    <tbody>
                      {AllEpisodes.map((episode, index)=>{
                        return (
                          <tr key={episode.id}>
                              <td style={{ width: 72  }}> 
                                < Image
                                  width={120}
                                  height={120}
                                  src={episode.thumbnail}
                                  alt={episode.title}
                                  objectFit="cover"
                                /> 
                              </td>
                              <td>
                                < Link href={`/episodes/${episode.id}`} >
                                  <a>{episode.title}</a>
                                </Link>
                              </td>
                              <td>{episode.members}</td>
                              <td style={{ width: 100 }}>{episode.published_at}</td>
                              <td>{episode.durattionAsString}</td>
                              <button type="button" onClick={() => PlayList(episodeList, index + LatesEpisodes.length)}>
                                <img src="/play-green.svg" alt="tocar episodio"/>
                              </button>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
           </section>
    </div>
  )
}

export  const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes",{
    params : {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }

    
  })

  const episodes = data.map( episode =>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode. published_at),'d MMM yy', {locale: ptBR} ),
      durantion: Number(episode.file.duration),
      durattionAsString: ConvertDurationToString(Number(episode.file.duration)),
      description:  episode.description,
      url: episode.file.url,
      


    }
  })
   
  const LatesEpisodes = episodes.slice(0, 2);
  const AllEpisodes = episodes.slice(2, episodes.length);

  return {
    props:{
       LatesEpisodes,
       AllEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
  
}
