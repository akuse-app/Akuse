import './styles/AnimeEntry.css';

import { faCalendar, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getAvailableEpisodes,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeModal from './modals/AnimeModal';
import Skeleton from 'react-loading-skeleton';
import { AnimeModalWatchButtons } from './modals/AnimeModalElements';

const StatusDot: React.FC<{
  listAnimeData?: ListAnimeData | undefined;
}> = ({ listAnimeData }) => {
  return (
    <>
      {(listAnimeData?.media.mediaListEntry?.status === 'CURRENT' ||
        listAnimeData?.media.mediaListEntry?.status === 'REPEATING') &&
      listAnimeData.media.mediaListEntry.progress !==
        getAvailableEpisodes(listAnimeData.media) ? (
        <span className="up_to_date">
          <FontAwesomeIcon
            className="i"
            icon={faCircleDot}
            style={{ marginRight: 5 }}
          />
        </span>
      ) : (
        listAnimeData?.media.status === 'RELEASING' && (
          <span className="releasing">
            <FontAwesomeIcon
              className="i"
              icon={faCircleDot}
              style={{ marginRight: 5 }}
            />
          </span>
        )
      )}
      {listAnimeData?.media.status === 'NOT_YET_RELEASED' && (
        <span className="not_yet_released">
          <FontAwesomeIcon
            className="i"
            icon={faCircleDot}
            style={{ marginRight: 5 }}
          />
        </span>
      )}
    </>
  );
};

const AnimeEntry: React.FC<{
  listAnimeData?: ListAnimeData;
}> = ({ listAnimeData }) => {
  const { t } = useTranslation();

  // Whether the modal is shown or not
  const [showModal, setShowModal] = useState<boolean>(false);
  // Whether the modal has been opened at least once (used to fetch episodes info only once when opening it)
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {listAnimeData && hasModalBeenShowed && (
        <AnimeModal
          listAnimeData={listAnimeData}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <div
        className={`anime-entry show ${listAnimeData ? '' : 'skeleton'}`}
        onClick={() => {
          setShowModal(true);
          if (!hasModalBeenShowed) setHasModalBeenShowed(true);
        }}
      >
        {listAnimeData ? (
          <div
            className="anime-cover"
            style={{
              backgroundColor: !imageLoaded
                ? listAnimeData.media.coverImage?.color
                : 'transparent',
            }}
          >
            <img
              src={listAnimeData.media.coverImage?.large}
              alt={t('animeCoverAlt', { title: getTitle(listAnimeData.media) })}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </div>
        ) : (
          <Skeleton className="anime-cover" />
        )}

        <div className="content">
          <div className="anime-title">
            {listAnimeData ? (
              <>
                <StatusDot listAnimeData={listAnimeData} />
                {getTitle(listAnimeData.media)}
              </>
            ) : (
              <Skeleton count={2} />
            )}
          </div>

          <div className="anime-info">
            <div className="season-year">
              {listAnimeData && (
                <FontAwesomeIcon
                  className="i"
                  icon={faCalendar}
                  style={{ marginRight: 5 }}
                />
              )}
              {listAnimeData ? (
                getParsedSeasonYear(listAnimeData?.media)
              ) : (
                <Skeleton />
              )}
            </div>
            <div className="episodes">
              {listAnimeData ? (
                getParsedFormat(listAnimeData?.media.format)
              ) : (
                <Skeleton />
              )}
              {listAnimeData && (
                <FontAwesomeIcon
                  className="i"
                  icon={faTv}
                  style={{ marginLeft: 5 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeEntry;
