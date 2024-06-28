export type MediaTitle = {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
};

export type MediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'
  | 'MANGA'
  | 'NOVEL'
  | 'ONE_SHOT';

export type MediaStatus =
  | 'FINISHED'
  | 'RELEASING'
  | 'NOT_YET_RELEASED'
  | 'CANCELLED'
  | 'HIATUS';

export type FuzzyDate = {
  year?: number;
  month?: number;
  day?: number;
};

export type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

export type MediaCoverImage = {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
};

export type AiringSchedule = {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  mediaId: number;
  media?: Media;
};

export type MediaListStatus =
  | 'CURRENT'
  | 'PLANNING'
  | 'COMPLETED'
  | 'DROPPED'
  | 'PAUSED'
  | 'REPEATING';

export type MediaList = {
  id: number;
  mediaId: number;
  status?: MediaListStatus;
  score?: number;
  progress?: number;
};

export type MediaListCollection = {
  user: MediaListUserInfo;
  lists: {
    status: MediaListStatus;
    name: string;
    entries: {
      id: number;
      mediaId: number;
      status: MediaStatus;
      progress: number;
      score: number;
      media: Media;
    };
  };
};

export type MediaListUserInfo = {
  id: number;
  name: string;
  avatar?: {
    large?: string;
    medium?: string;
  };
  bannerImage: string;
  createdAt: number;
  about: string;
  mediaListOptions: {
    animeList: {
      sectionOrder: MediaListStatus;
    };
  };
  statistics?: {
    anime: {
      count: number;
      episodesWatched: number;
      meanScore: number;
      minutesWatched: number;
    };
  };
};

export type MediaTrailer = {
  id?: string;
  site?: string;
  thumbnail?: string;
};

export type PageInfo = {
  total: number;
  currentPage: number;
  hasNextPage: number;
};

export type Media = {
  id?: number;
  title?: MediaTitle;
  format?: MediaFormat;
  status?: MediaStatus;
  description?: string;
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  season?: MediaSeason;
  seasonYear?: number;
  episodes: number;
  duration?: number;
  coverImage?: MediaCoverImage;
  bannerImage?: string;
  genres?: string[];
  synonyms?: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites?: number;
  isAdult?: boolean;
  nextAiringEpisode?: AiringSchedule;
  mediaListEntry?: MediaList;
  siteUrl?: string;
  trailer?: MediaTrailer;
};
