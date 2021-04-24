import  '../styles/global.scss';
import { Header } from '../componentes/Header'
import { Player } from '../componentes/player';
import styles from '../styles/app.module.scss';
import {PlayerContextProvid} from '../contexts/PlayerContexts'


function MyApp({ Component, pageProps }) {
    return(
      < PlayerContextProvid>
          <div className={styles.wrapper}>
          <main>
            <Header/>
            <Component  {...pageProps}/>
          </main>
          < Player />
        </div>
        </PlayerContextProvid>
    );
    
  }

export default MyApp
