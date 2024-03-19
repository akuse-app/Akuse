'use-strict'

const Consumet = require('@consumet/extensions')

/**
 * Methods to fetch anime video sources and data using Consumet library 
 * 
 * @class
 */
module.exports = class AnimeSaturn {

    /**
     * @constructor
     */
    constructor() {
        this.consumet = new Consumet.ANIME.AnimeSaturn
    }

    /**
     * Gets the episode url and isM3U8 flag
     * 
     * @param {*} animeSearch 
     * @param {*} episode 
     * @returns episode object (url + isM3U8 flag) in streamtape quality
     * @returns -1 if could not get the animeId or the animeEpisodeId
     */
    async getEpisodeUrl(animeSearch, episode, dubbed) {
        let animeId = await this.getAnimeId(dubbed ? `${animeSearch} (ITA)` : animeSearch)
        if (animeId == -1) {
            console.log(`Could not get animeId for DUB: ${animeSearch}`);
            animeId = await this.getAnimeId(animeSearch);
        }

        if (animeId == -1) return -1

        const animeEpisodeId = await this.getAnimeEpisodeId(animeId, episode)
        if (animeEpisodeId === undefined) return -1

        const data = await this.consumet.fetchEpisodeSources(animeEpisodeId)

        return data.sources[1] // [1] is streamtape
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