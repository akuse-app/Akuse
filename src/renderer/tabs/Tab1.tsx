import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ListAnimeData, UserInfo } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Slideshow from '../components/Slideshow';
import UserNavbar from '../components/UserNavbar';

interface Tab1Props {
  userInfo?: UserInfo;
  currentListAnime?: ListAnimeData[];
  trendingAnime?: ListAnimeData[];
  mostPopularAnime?: ListAnimeData[];
  nextReleasesAnime?: ListAnimeData[];
}

const Tab1: React.FC<Tab1Props> = ({
  userInfo,
  currentListAnime,
  trendingAnime,
  mostPopularAnime,
  nextReleasesAnime,
}) => {
  const logged = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className="body-container show-tab">
      <div className="main-container">
        <main>
          <Slideshow listAnimeData={trendingAnime} />

          <div className="section-container">
            {logged && (
              <AnimeSection
                title={t('continue_watching')}
                animeData={currentListAnime}
              />
            )}
            <AnimeSection title={t('trending_now')} animeData={trendingAnime} />
            <AnimeSection title={t('most_popular')} animeData={mostPopularAnime} />
            <AnimeSection title={t('next_releases')} animeData={nextReleasesAnime} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tab1;
