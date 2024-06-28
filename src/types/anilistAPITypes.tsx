import { Media, PageInfo } from './anilistGraphQLTypes';

export type UserInfo = {
  id: number;
  name: string;
  avatar?: {
    large?: string;
    medium?: string;
  };
};

export type AnimeData = {
  media?: Media[];
  pageInfo?: PageInfo;
};

export type ListAnimeData = {
  score: any;
  id: number | null;
  mediaId: number | null;
  progress?: number | null;
  media: Media;
};

export type TrendingAnime = AnimeData;
export type MostPopularAnime = AnimeData;
export type CurrentListAnime = ListAnimeData[];
