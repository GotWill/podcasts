import  ptBR from 'date-fns/locale/pt-BR'
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import {ConvertDurationToString} from '../../utils/ConvertDurationToString';
import {useRouter } from 'next/router';

 
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
        <h1>{episode.title}</h1>
    )
}
 
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

    const slug = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)
    const episode ={
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            published_At: format(parseISO(data.published_at),'d MMM yy', {locale: ptBR} ),
            durantion: Number(data.file.durantion),
            durattionAsString: ConvertDurationToString(Number(data.file.durantion)),
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