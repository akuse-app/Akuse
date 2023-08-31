'use-strict'

const AniListAPI = require ('../anilist/anilistApi')
const AnimeSaturn = require('../providers/animesaturn')
const Video = require('./video')
const clientData = require ('../clientData.js')

module.exports = class htmlManipulation {
    constructor() {
        this.anilist = new AniListAPI()
        this.cons = new AnimeSaturn()
        this.video = new Video()
        this.months = {
            '1': 'Jan',
            '2': 'Feb',
            '3': 'Mar',
            '4': 'Apr',
            '5': 'May',
            '6': 'Jun',
            '7': 'Jul',
            '8': 'Aug',
            '9': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }
    }

    displayUserAnimeSection(entries, section) {
        Object.keys(entries).forEach(key => {
            let anime_list_div = document.getElementById(section)
            let anime_entry_div = this.appendAnimeEntry(entries[key].media, key)
            anime_list_div.appendChild(anime_entry_div)
        })
    }

    displayGenreAnimeSection(entries, section) {
        Object.keys(entries.media).forEach(key => {
            let anime_list_div = document.getElementById(section)
            let anime_entry_div = this.appendAnimeEntry(Object.values(entries.media)[key], key)
            anime_list_div.appendChild(anime_entry_div)
        })
    }

    appendAnimeEntry(animeEntry, key) {
        let anime_entry_div = this.createAnimeEntry(animeEntry, key)
        
        anime_entry_div.classList.add('show')
        return anime_entry_div
    }

    createAnimeEntry(animeEntry) {
        const animeId = animeEntry.id
        const animeName = animeEntry.title.english
        /* const progress = animeEntry.progress */
        const cover = animeEntry.coverImage.extraLarge
        
        var episodes
        animeEntry.episodes == null
        ? episodes = '?'
        : episodes = animeEntry.episodes
    
        let anime_entry_div = document.createElement('div')
        anime_entry_div.classList.add('anime-entry')
        
        anime_entry_div.id = ('anime-entry-' + animeId)
    
        let anime_cover_div = document.createElement('img')
        anime_cover_div.classList.add('anime-cover')
        anime_cover_div.src = cover
        anime_cover_div.alt = 'cover'
    
        let anime_title_div = document.createElement('div')
        anime_title_div.classList.add('anime-title')
        anime_title_div.innerHTML = animeName
    
        /* let anime_progress_div = document.createElement('div')
        anime_progress_div.classList.add('anime-progress')
        anime_progress_div.innerHTML = `${progress} / ${episodes}` */
    
        let anime_entry_content = document.createElement('div')
        anime_entry_content.classList.add('content')
        anime_entry_content.appendChild(anime_title_div)
        /* anime_entry_content.appendChild(anime_progress_div) */
        
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(anime_entry_content)
        /* anime_entry_div.classList.add('fade-in') */
        
        return anime_entry_div
    }

    displayFeaturedAnime(animeEntry) {
        const id = animeEntry.id
        const title = animeEntry.title.english
        const episodes = animeEntry.episodes
        const startYear = animeEntry.startDate.year
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        var anime_genres_div = document.getElementById('featured-anime-genres')
        
        document.querySelectorAll('button[id^="featured-anime-button-"]')[0].id += id
        document.getElementById('featured-anime-title').innerHTML = title
        document.getElementById('featured-anime-year').innerHTML = startYear
        document.getElementById('featured-anime-episodes').innerHTML = episodes + " Episodes"
    
        Object.keys(genres).forEach( (key) => {
            anime_genres_div.innerHTML += genres[key]
            if(parseInt(key) < Object.keys(genres).length - 1) {
                anime_genres_div.innerHTML += " • "
            }
        })
    
        document.getElementById('featured-img').src = banner
        document.getElementById('featured-content').classList.add('show')
    }

    displayUserAvatar(userInfo) {
        document.getElementById('user-icon').src = userInfo.User.avatar.large
    }

    triggerAnimeEntry(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            const entry = event.target.closest('.anime-entry')
            if(entry) {
                this.displayAnimePage(entry.id.slice(12))
            }
        } else {
            this.displayAnimePage(event.target.id.slice(12))
        }
    }

    // display the anime modal page
    async displayAnimePage(animeId) {
        // show modal page
        document.getElementById('anime-page').style.display = 'flex'
        document.getElementById('anime-page-shadow-background').style.display = 'flex'
        
        // get infos
        const anilist = new AniListAPI(clientData)
        const animeEntry = await anilist.getAnimeInfo(animeId)

        const title = animeEntry.title.english
        const description = animeEntry.description
        const status = animeEntry.status
        const startDate = this.months[animeEntry.startDate.month] + " " + animeEntry.startDate.day + ", "  + animeEntry.startDate.year
        const cover = animeEntry.coverImage.extraLarge
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        const seasonYear = animeEntry.seasonYear
        const format = animeEntry.format
        const duration = animeEntry.duration
        const meanScore = animeEntry.meanScore
        const animeTitles = [title].concat(Object.values(animeEntry.synonyms))

        var endDate
        animeEntry.endDate.year == null
        ? endDate = '?'
        : endDate = this.months[animeEntry.endDate.month] + " " + animeEntry.endDate.day + ", "  + animeEntry.endDate.year

        var episodes
        animeEntry.episodes == null
        ? episodes = animeEntry.nextAiringEpisode.episode - 1
        : episodes = animeEntry.episodes

        // display infos
        document.getElementById('page-anime-title').innerHTML = title
        document.getElementById('page-anime-seasonYear').innerHTML = seasonYear
        document.getElementById('page-anime-format').innerHTML = format
        document.getElementById('page-anime-duration').innerHTML = (duration + ' Ep/Min')
        document.getElementById('page-anime-meanScore').innerHTML =  meanScore
        document.getElementById('page-anime-description').innerHTML = description
        document.getElementById('page-anime-episodes').innerHTML = episodes
        document.getElementById('page-anime-status').innerHTML = status
        document.getElementById('page-anime-startDate').innerHTML = startDate
        document.getElementById('page-anime-endDate').innerHTML = endDate
        document.getElementById('page-anime-cover').src = cover
        
        var anime_genres_ul = document.getElementById('page-anime-genres')
        Object.keys(genres).forEach( (key) => {
            var anime_genres_li = document.createElement('li')
            anime_genres_li.innerHTML += genres[key]
            anime_genres_ul.appendChild(anime_genres_li)
        })

        var anime_titles_div = document.getElementById('page-anime-titles')
        Object.keys(animeTitles).forEach( (key) => {
            let h2 = document.createElement('h2')
            h2.innerHTML = animeTitles[key]
            anime_titles_div.appendChild(h2)
        })

        // episodes
        const episodes_list_div = document.getElementById('page-anime-episodes-list')
        
        for(let i=0; i<episodes; i++) {
            let episode_div = this.createEpisode(i, banner)
            episodes_list_div.appendChild(episode_div)
        }

        document.getElementById('anime-page').classList.add('show-page')
        document.getElementById('anime-page-shadow-background').classList.add('show-page-shadow-background')
        document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    }

    // create the episode div, provided with unique id
    createEpisode(i, banner) {
        let episode_div = document.createElement('div')
        episode_div.classList.add('episode')
        episode_div.id = 'episode-' + (i+1)
        episode_div.style.backgroundImage = `url(${banner})`

        let episode_content_div = document.createElement('div')
        episode_content_div.classList.add('content')
        
        let h3 = document.createElement('h3')
        h3.innerHTML = 'Episode ' + (i+1)

        episode_content_div.appendChild(h3)
        episode_div.appendChild(episode_content_div)

        episode_div.classList.add('show-episode')

        return episode_div
    }

    triggerEpisode(event) {
        if(!(event.target.classList.contains('episode'))) {
            const entry = event.target.closest('.episode')
            if(entry) {
                this.video.displayVideo(entry.id.slice(8))
            }
        } else {
            this.video.displayVideo(event.target.id.slice(8))
        }
    }


    // close the anime modal page
    closeAnimePage() {
        // hide modal page
        document.getElementById('anime-page').style.display = 'none'
        document.getElementById('anime-page-shadow-background').style.display = 'none'
        document.getElementsByTagName('body')[0].style.overflow = 'auto'

        // clear infos
        document.getElementById('page-anime-title').innerHTML = ""
        document.getElementById('page-anime-description').innerHTML = ""
        document.getElementById('page-anime-status').innerHTML = ""
        document.getElementById('page-anime-startDate').innerHTML = ""
        document.getElementById('page-anime-endDate').innerHTML = ""
        document.getElementById('page-anime-cover').src = ""
        document.getElementById('page-anime-genres').innerHTML = ""
        document.getElementById('page-anime-episodes-list').innerHTML = ""
        document.getElementById('page-anime-episodes').innerHTML = ""
        document.getElementById('page-anime-titles').innerHTML = ""
        document.getElementById('page-anime-seasonYear').innerHTML = ""
        document.getElementById('page-anime-format').innerHTML = ""
        document.getElementById('page-anime-duration').innerHTML = ""
        document.getElementById('page-anime-meanScore').innerHTML = ""
    }

    // search bar (NOT WORKING)
    searchWithBar() {
        var txtValue;
        var input = document.getElementById('search-bar');
        var filter = input.value.toLowerCase().replace(/\s/g, '');
        var items = document.getElementsByClassName('anime-title');
        var itemsCard = document.getElementsByClassName('anime-entry')

        Object.keys(items).forEach( key => {
            txtValue = items[key].textContent || a.innerText;
            if (txtValue.toLowerCase().replace(/\s/g, '').indexOf(filter) > -1) {
                itemsCard[key].style.display = "";
            } else {
                itemsCard[key].style.display = "none";
            }
        })
    }

    // checks if an element is in viewport
    isInViewport(element) {
        var bounding = element.getBoundingClientRect()
    
        if (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)   
        ) return true
        
        return false
    } 
}