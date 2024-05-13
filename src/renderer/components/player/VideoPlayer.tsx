import {
  faAngleLeft,
  faCompress,
  faExpand,
  faForward,
  faPause,
  faPlay,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import { getEpisodeUrl as animesaturn } from '../../../modules/providers/animesaturn';
import { getEpisodeUrl as gogoanime } from '../../../modules/providers/gogoanime';
import Settings from './VideoSettings';
import { EpisodeInfo } from '../../../types/types';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import Store from 'electron-store';
import {
  getAvailableEpisodes,
  getParsedAnimeTitles,
} from '../../../modules/utils';
import 'react-activity/dist/Dots.css';
import Dots from 'react-activity/dist/Dots';
import { IVideo } from '@consumet/extensions';

const STORE = new Store();
var timer: any;
interface VideoPlayerProps {
  url?: string;
  isM3U8?: boolean;
  listAnimeData: ListAnimeData;
  episodesInfo: EpisodeInfo[] | null;
  animeEpisodeNumber: number;
  show: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  isM3U8 = false,
  listAnimeData,
  episodesInfo,
  animeEpisodeNumber,
  show,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // const [title, setTitle] = useState<string>(animeTitle); // may be needed in future features
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoIsM3U8, setVideoIsM3U8] = useState<boolean>();
  const [episodeNumber, setEpisodeNumber] = useState<number>(0);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [episodeDescription, setEpisodeDescription] = useState<string>('');

  // controls
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setVideoUrl(url);
    setVideoIsM3U8(isM3U8);
    setEpisodeNumber(animeEpisodeNumber);
    setEpisodeTitle(
      episodesInfo
        ? episodesInfo[animeEpisodeNumber].title?.en ??
            `Episode ${animeEpisodeNumber}`
        : `Episode ${animeEpisodeNumber}`,
    );
    setEpisodeDescription(
      episodesInfo ? episodesInfo[animeEpisodeNumber].summary ?? '' : '',
    );
  });

  const playVideo = () => {
    if (videoRef.current) {
      setPlaying(true);
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      setPlaying(false);
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    if (show && videoUrl && videoRef.current) {
      if (videoIsM3U8) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current as HTMLVideoElement);
          setTimeout(() => {
            playVideo();
          }, 1000);
        } else if (
          videoRef.current.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoRef.current.src = videoUrl;
          setTimeout(() => {
            playVideo();
          }, 1000);
        }
      } else {
        videoRef.current.src = videoUrl;
        setTimeout(() => {
          playVideo();
        }, 1000);
      }
    }
  }, [show, videoUrl, videoIsM3U8]);

  const handleMouseMove = () => {
    clearTimeout(timer);
    setShowControls(true);
    setShowCursor(true);

    timer = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 2000);
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    } else {
      if (document.documentElement.requestFullscreen) {
        setFullscreen(true);
        document.documentElement.requestFullscreen();
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      playing ? pauseVideo() : playVideo();
    }
  };

  const nextEpisode = async () => {
    setLoading(true);
    const nextEpisodeNumber = episodeNumber + 1;

    const lang = (await STORE.get('source_flag')) as string;
    const dubbed = (await STORE.get('dubbed')) as boolean;
    const animeTitles = getParsedAnimeTitles(listAnimeData.media);

    switch (lang) {
      case 'US': {
        gogoanime(animeTitles, nextEpisodeNumber, dubbed).then((value) => {
          setData(value);
          setLoading(false);
        });
        break;
      }
      case 'IT': {
        animesaturn(animeTitles, nextEpisodeNumber, dubbed).then((value) => {
          setData(value);
          setLoading(false);
        });
        break;
      }
    }

    const setData = (value: IVideo | null) => {
      setVideoUrl(value?.url);
      setVideoIsM3U8(value?.isM3U8);
      setEpisodeNumber(nextEpisodeNumber);
      setEpisodeTitle(
        episodesInfo
          ? episodesInfo[nextEpisodeNumber].title?.en ??
              `Episode ${nextEpisodeNumber}`
          : `Episode ${nextEpisodeNumber}`,
      );
      setEpisodeDescription(
        episodesInfo ? episodesInfo[nextEpisodeNumber].summary ?? '' : '',
      );
    };
  };

  return (
    show && (
      <div
        className={`container ${showControls ? 'show-controls' : ''}`}
        onMouseMove={handleMouseMove}
      >
        <div className="pause-info">
          <div className="content">
            <h1 className="you-are-watching">You are watching</h1>
            <h1 id="pause-info-anime-title">
              {listAnimeData.media.title?.english}
            </h1>
            <h1 id="pause-info-episode-title">{episodeTitle}</h1>
            <h1 id="pause-info-episode-description">{episodeDescription}</h1>
          </div>
        </div>
        <div className={`shadow-controls ${showCursor ? 'show-cursor' : ''}`}>
          <div className="up-controls">
            <div className="left">
              <div className="info exit-video" onClick={onClose}>
                <span className="title">
                  {listAnimeData.media.title?.english}
                </span>
                <span className="back">
                  <FontAwesomeIcon className="i" icon={faAngleLeft} />
                  <span className="episode">
                    <span>{`Ep. ${episodeNumber} - `}</span>
                    {episodeTitle}
                  </span>
                </span>
              </div>
            </div>
            <div className="center"></div>
            <div className="right">
              <Settings videoRef={videoRef} />
              <button className="fullscreen" onClick={toggleFullScreen}>
                <FontAwesomeIcon
                  className="i"
                  icon={fullscreen ? faCompress : faExpand}
                />
              </button>
              {episodeNumber !== getAvailableEpisodes(listAnimeData.media) && (
                <button
                  className="next show-next-episode-btn"
                  onClick={nextEpisode}
                >
                  <FontAwesomeIcon className="i" icon={faForward} />
                </button>
              )}
            </div>
          </div>
          <div className="mid-controls">
            {loading ? (
              <Dots />
            ) : (
              <>
                <button className="skip-backward">
                  <FontAwesomeIcon className="i" icon={faRotateLeft} />
                </button>
                <div className="play-pause-center">
                  <button className="play-pause" onClick={handlePlayPause}>
                    <i className="fas fa-play"></i>
                    <FontAwesomeIcon
                      className="i"
                      icon={playing ? faPause : faPlay}
                    />
                  </button>
                </div>
                <div>
                  <button className="skip-forward">
                    <FontAwesomeIcon className="i" icon={faRotateRight} />
                  </button>
                  {/* <button className="skip-forward-small">
                    <FontAwesomeIcon className="i" icon={faRotateRight} />
                  </button> */}
                </div>
              </>
            )}
          </div>
          <div className="bottom-controls">
            <p className="current-time">00:00</p>
            <div className="video-timeline">
              <div className="progress-area">
                <span>00:00</span>
                <div className="video-progress-bar"></div>
              </div>
            </div>
            <p className="video-duration">00:00</p>
          </div>
        </div>
        <video id="video" ref={videoRef}></video>
      </div>
    )
  );
};

export default VideoPlayer;
