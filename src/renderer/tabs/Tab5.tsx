import { userInfo } from 'os';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

import { ListAnimeData, UserInfo } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';
import Slideshow from '../components/Slideshow';
import UserNavbar from '../components/UserNavbar';
import {
  filterFormattedSchedule,
  getAiringSchedule,
  isAired,
  timeStamptoAMPM,
  transformSchedule,
} from '../../modules/utils';
import AnimeAiring from '../components/AnimeAiring';
import { waitFor } from '@testing-library/react';

interface Tab5Props {
  schedule?: any;
  clicked: () => void;
}

const dayofweek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const Tab5: React.FC<Tab5Props> = ({ schedule, clicked }) => {
  useEffect(() => {
    clicked();
    setLoading(true);
    async function setDay() {
      const now = new Date();
      const today = dayofweek[now.getDay()];
      setFilterDay(today);
      setLoading(false);
    }
    setDay();
  }, []);

  const [filterDay, setFilterDay] = useState('All');
  const [loading, setLoading] = useState(true);

  return (
    <div className="body-container  show-tab">
      <div className="main-container">
        <div className="day-list">
          <div
            key={'all'}
            className={`day-filter ${filterDay === 'All' ? 'active' : ''}`}
            onClick={() => setFilterDay('All')}
          >
            All
          </div>
          {dayofweek.map((day) => (
            <div
              key={day}
              className={`day-filter ${filterDay === day ? 'active' : ''}`}
              onClick={() => {
                setLoading(true);
                setFilterDay(day);
                setLoading(false);
              }}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="airing-list">
          {!loading ? (
            Object.entries(
              filterFormattedSchedule(transformSchedule(schedule), filterDay),
            ).map(([day, timeSlots]: any, index) => (
              <div key={`section-${day}`} className="section">
                <h1 key={`${day}-title`}>{day}</h1>
                <div key={`${day}-entry`} className="entry">
                  {Object.entries(timeSlots).map(([time, animeList]: any) => (
                    <>
                      {animeList.map((s: any, index: any) => (
                        <>
                          {!s.media.isAdult ? (
                            <AnimeAiring key={s.mediaId} listAnimeData={s} />
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div key={`loading`} className="loading">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tab5;
