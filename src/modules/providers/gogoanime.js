'use-strict'

const Consumet = require('@consumet/extensions')

/**
 * Methods to fetch anime video sources and data using Consumet library 
 * 
 * @class
 */
module.exports = class Gogoanime {

    /**
     * @constructor
     */
    constructor() {
        this.consumet = new Consumet.ANIME.Gogoanime
    }

    /**
     * Gets the episode url and isM3U8 flag
     * 
     * @param {*} animeSearch 
     * @param {*} episode 
     * @returns episode object (url + isM3U8 flag) searching for best quality in decrescent order (1080p -> 720p -> default)
     * @returns -1 if could not get the animeId or the animeEpisodeId
     */
    async getEpisodeUrl(animeSearch, episode, dubbed) {
        const searchQuery = dubbed ? `${animeSearch} (Dub)` : animeSearch;

        // Get animeId
        let animeId = await this.getAnimeId(searchQuery);
        if (animeId == -1) {
            console.log(`Could not get dub for: ${searchQuery}`);
            animeId = await this.getAnimeId(animeSearch);
        };

        if (animeId == -1) return -1;

        // Get animeEpisodeId
        const animeEpisodeId = await this.getAnimeEpisodeId(animeId, episode);
        if (animeEpisodeId === undefined) return -1;

        // Fetch episode sources
        const data = await this.consumet.fetchEpisodeSources(animeEpisodeId);

        // Get the source with the best resolution
        const resolutions = ['1080p', '720p', 'default'];
        for (const resolution of resolutions) {
            const source = data.sources.find(src => src.quality === resolution);
            if (source) {
                console.log(`Playing episode in ${source.quality}`);
                return source;
            }
        }

        return data.sources[0];
    }

    /**
     * Gets the anime id
     * 
     * @param {*} animeSearch 
     * @returns anime id
     * @returns -1 if could not get the animeId
     */
    async getAnimeId(animeSearch) {
        const data = await this.consumet.search(animeSearch)

        if (data.results.length !== 0) {
            return data.results[0].id
        } else {
            return -1
        }
    }

    /**
     * Gets the anime episode id
     * 
     * @param {*} animeId 
     * @param {*} episode 
     * @returns anime episode id
     */
    async getAnimeEpisodeId(animeId, episode) {
        const data = await this.consumet.fetchAnimeInfo(animeId)
        return data.episodes[episode - 1]?.id
    }
}