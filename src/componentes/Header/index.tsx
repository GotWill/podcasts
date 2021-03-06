import format from 'date-fns/format';

import ptBr from  'date-fns/locale/pt-BR';

import  styles from './styles.module.scss' ;
import Link from 'next/link';

export  function Header(){

    const currentdate = format(new Date(), 'EEEEEE, d MMM',{
        locale: ptBr,
    });
    return (
        <header className={styles.headerContainer}>
            < Link href="/">
                 <img src="/logo.svg" alt="Podcastr"/>
            </ Link>
            <p>O Melhor pra voce ouvir, sempre</p>
            <span>{currentdate}</span>
        </header>
    );
}