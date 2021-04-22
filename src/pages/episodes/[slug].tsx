import  ptBR from 'date-fns/locale/pt-BR'
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import {ConvertDurationToString} from '../../utils/ConvertDurationToString';
import {useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
 
import styles from './episode.module.scss';
import { route } from 'next/dist/next-server/server/router';
 
type Episode = {
    id: string;
    title: string;
    members: string;
    published_at: string;
    duration: number;
    thumbnail: string;
    durattionAsString: string;
    url: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode } : EpisodeProps) {

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                < Link  href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="voltar"/>
                    </button>
                </ Link>
                < Image  width={700}
                    height={160} 
                    src={episode.thumbnail} 
                    objectFit="cover"
                  />
                  <button type="button">
                        <img src="/play.svg" alt="Tocar episodio"/>
                  </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.published_at}</span>
                <span>{episode.durattionAsString}</span>

            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    )
}
 
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get("episodes",{
        params : {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
    })
        const paths = data.map(episode =>{
            return {
                params : {
                    slug: episode.id
                }
            }
        }) 
    return {
        paths,
        fallback:  true
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

    const { slug } = ctx.params;
      const { data } = await api.get(`/episodes/${slug}`)
    const episode ={
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            published_t: format(parseISO(data.published_at),'d MMM yy', {locale: ptBR} ),
            durantion: Number(data.file.durantion),
            durattionAsString: ConvertDurationToString(Number(data.file.duration)),
            description:  data.description,
            url: data.file.url,
            
      
    }
    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,
    }
       
    
};