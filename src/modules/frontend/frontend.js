'use-strict'

const Store = require('electron-store')
const AniListAPI = require('../anilist/anilistApi')
const AnimeSaturn = require('../providers/animesaturn')
const Video = require('./video')
const Requests = require('../requests.js')
const { clipboard } = require('electron')

/**
 * Methods to manipulate the DOM with fetched data
 * 
 * @class
 */
module.exports = class Frontend {

    /**
     * @constructor
     */
    constructor() {
        this.store = new Store()
        this.anilist = new AniListAPI()
        this.cons = new AnimeSaturn()
        this.video = new Video()
        this.req = new Requests()
        this.episodesInfourl = 'https://api.ani.zip/mappings?anilist_id='
        this.months = {
            '1': 'January',
            '2': 'February',
            '3': 'March',
            '4': 'April',
            '5': 'May',
            '6': 'June',
            '7': 'July',
            '8': 'August',
            '9': 'Septempber',
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'Septempber',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        }
    }

    /**
     * Pages toggler
     */
    togglePage() {
        let lis = document.querySelectorAll('aside ul.upper li')
        let mains = document.querySelectorAll('main')
        let body_container = document.querySelector('.body-container')

        Object.keys(lis).forEach(i => {
            Object.values(lis)[i].addEventListener('click', () => {
                body_container.scrollTop = 0

                Object.values(lis).forEach(li => {
                    li.classList.remove('active')
                })
                Object.keys(mains).forEach(main => {
                    Object.values(mains)[main].style.display = 'none'
                })

                Object.values(lis)[i].classList.add('active')
                Object.values(mains)[i].style.display = 'block'
            })
        })
    }

    /**
     * Call to enable skeleton loader for featured section and anime sections
     */
    enableSkeletonLoader() {
        let anime_sections = document.querySelectorAll('section')
        let featured_scroller = document.querySelector('#featured-scroller .featured-scroller-wrapper')
        const nLoaders = 10

        // featured section
        featured_scroller.appendChild(this.createFeaturedEntrySkeletonLoader())

        // anime sections
        Object.keys(anime_sections).forEach(section => {
            let destination_div = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper .anime-list')

            for (let i = 0; i < nLoaders; i++) {
                let anime_entry_div = this.createAnimeEntrySkeletonLoader()
                destination_div.appendChild(anime_entry_div)
            }
        })
    }

    /**
     * Creates a skeleton loader anime section entry div
     * 
     * @returns skeleton loader anime entry
     */
    createAnimeEntrySkeletonLoader() {
        let anime_entry_div = document.createElement('div')
        let anime_cover_div = document.createElement('div')
        let content_div = document.createElement('div')
        let anime_info_div = document.createElement('div')

        anime_entry_div.id = 'anime-entry--1'
        anime_entry_div.classList.add('anime-entry')
        anime_entry_div.classList.add('loading')
        anime_entry_div.classList.add('show')
        anime_cover_div.classList.add('anime-cover')
        content_div.classList.add('content')
        anime_info_div.classList.add('anime-info')

        content_div.appendChild(anime_info_div)
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(content_div)

        return anime_entry_div
    }

    /**
     * Creates a skeleton loader featured section div
     * 
     * @returns skeleton loader featured entry
     */
    createFeaturedEntrySkeletonLoader() {
        var featured_div = document.createElement('div')
        var featured_container_div = document.createElement('div')
        var content_div = document.createElement('div')
        var anime_title_div = document.createElement('div')
        var anime_info_div = document.createElement('div')
        var anime_description_div = document.createElement('div')
        var featured_anime_button = document.createElement('button')
        var anime_year_div = document.createElement('div')
        var anime_episodes_div = document.createElement('div')

        featured_div.classList.add('featured')
        featured_div.classList.add('loading')
        featured_container_div.classList.add('featured-container')
        content_div.classList.add('content')
        content_div.classList.add('show')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        anime_description_div.classList.add('anime-description')
        anime_year_div.classList.add('anime-year')
        anime_episodes_div.classList.add('anime-episodes')
        featured_anime_button.id = 'featured-anime-button--1'
        featured_anime_button.classList.add('main-button-0')

        anime_info_div.appendChild(anime_year_div)
        anime_info_div.appendChild(anime_episodes_div)
        content_div.appendChild(anime_info_div)
        content_div.appendChild(anime_title_div)
        content_div.appendChild(anime_description_div)
        content_div.appendChild(featured_anime_button)
        featured_container_div.appendChild(content_div)
        featured_div.appendChild(featured_container_div)

        return featured_div
    }

    /**
     * Assigns a different z-index to each section entry
     * 
     * @param {*} sectionId 
     */
    assignZIndexToAnimeEntries(sectionId) {
        let section_div = document.getElementById(sectionId)
        let anime_entries = section_div.querySelectorAll('.anime-entry')

        Object.keys(anime_entries).forEach(entry => {
            let entry_div = Object.values(anime_entries)[entry]

            entry_div.style.zIndex = Object.keys(anime_entries).length - entry
        })
    }

    /**
     * Shows the modal page
     * 
     * @param {*} shadowModalDiv the shadow modal page to show
     * @param {*} pageModalDiv the modal page to show
     */
    showModalPage(shadowModalDiv, pageModalDiv) {
        document.getElementById(pageModalDiv).style.display = 'flex'
        document.getElementById(shadowModalDiv).style.display = 'flex'

        document.getElementById(pageModalDiv).classList.remove('hide-page')
        document.getElementById(pageModalDiv).classList.add('show-page')
        document.getElementById(shadowModalDiv).classList.remove('hide-page-shadow-background')
        document.getElementById(shadowModalDiv).classList.add('show-page-shadow-background')

        /* document.getElementsByClassName('body-container')[0].style.overflow = 'hidden' */
    }

    /**
     * Hides the modal page
     * 
     * @param {*} shadowModalDiv the shadow modal page to hide
     * @param {*} pageModalDiv the modal page to hide
     */
    hideModalPage(shadowModalDiv, pageModalDiv) {
        document.getElementById(pageModalDiv).classList.remove('show-page')
        document.getElementById(pageModalDiv).classList.add('hide-page')
        document.getElementById(shadowModalDiv).classList.remove('show-page-shadow-background')
        document.getElementById(shadowModalDiv).classList.add('hide-page-shadow-background')

        setTimeout(() => {
            document.getElementById(pageModalDiv).style.display = 'none'
            document.getElementById(shadowModalDiv).style.display = 'none'
        }, 400)
    }

    /**
     * Call this to grant anime sections scrolling by "drag-n-dropping" them
     */
    enableAnimeSectionsDragAndScroll() {
        var sliders = document.getElementsByClassName('anime-list-wrapper')

        Object.keys(sliders).forEach(slider => {
            let mouseDown = false
            let startX, scrollLeft

            let startDragging = function (event) {
                mouseDown = true
                startX = event.pageX - Object.values(sliders)[slider].offsetLeft
                scrollLeft = Object.values(sliders)[slider].scrollLeft
            }

            let stopDragging = function () {
                mouseDown = false
            }

            Object.values(sliders)[slider].addEventListener('mousemove', (event) => {
                event.preventDefault()
                if (!mouseDown) { return }
                const x = event.pageX - Object.values(sliders)[slider].offsetLeft
                const scroll = x - startX
                Object.values(sliders)[slider].scrollLeft = scrollLeft - scroll
            })

            Object.values(sliders)[slider].addEventListener('mousedown', startDragging, false)
            Object.values(sliders)[slider].addEventListener('mouseup', stopDragging, false)
            Object.values(sliders)[slider].addEventListener('mouseleave', stopDragging, false)
        })
    }

    /**
     * Hides useless scrolling buttons in anime sections 
    */
    doDisplayAnimeSectionsScrollingButtons() {
        let anime_sections = document.querySelectorAll('section')

        Object.keys(anime_sections).forEach(section => {
            let anime_section_wrapper = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper')
            let anime_section_list = Object.values(anime_sections)[section].querySelector('.anime-list')
            let anime_section_scroll_left = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[0]
            let anime_section_scroll_right = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[1]
            let wrapperWidth = anime_section_wrapper.clientWidth
            let listWidth = anime_section_list.scrollWidth

            if (wrapperWidth > listWidth) {

                anime_section_scroll_left.classList.add('hide')
                anime_section_scroll_right.classList.add('hide')
            }
        })
    }

    enableFeaturedSectionScrollingButtons() {
        // featured section buttons
        let featured_container_div = document.getElementsByClassName('featured-scroller-wrapper')[0]
        let featured_scroller_div = document.getElementsByClassName('featured-scroller')[0]
        let featured_left_button = document.getElementById('featured-scroll-left')
        let featured_right_button = document.getElementById('featured-scroll-right')

        // scroll
        featured_left_button.addEventListener('click', () => {
            featured_scroller_div.scrollLeft -= 1000
        })

        featured_right_button.addEventListener('click', () => {
            featured_scroller_div.scrollLeft += 1000
        })

        // show
        let showFeaturedScrollButtons = () => {
            featured_left_button.classList.remove('hide-opacity')
            featured_right_button.classList.remove('hide-opacity')
            featured_left_button.classList.add('show-opacity')
            featured_right_button.classList.add('show-opacity')
        }

        // hide
        let hideFeaturedScrollButtons = () => {
            featured_left_button.classList.remove('show-opacity')
            featured_right_button.classList.remove('show-opacity')
            featured_left_button.classList.add('hide-opacity')
            featured_right_button.classList.add('hide-opacity')
        }

        featured_container_div.addEventListener('mouseover', showFeaturedScrollButtons)
        featured_left_button.addEventListener('mouseover', showFeaturedScrollButtons)
        featured_right_button.addEventListener('mouseover', showFeaturedScrollButtons)

        featured_container_div.addEventListener('mouseout', hideFeaturedScrollButtons)
        featured_left_button.addEventListener('mouseout', hideFeaturedScrollButtons)
        featured_right_button.addEventListener('mouseout', hideFeaturedScrollButtons)
    }

    /**
     * Call this to grant anime sections scrolling with buttons
     */
    enableAnimeSectionsScrollingButtons() {
        let anime_sections = document.querySelectorAll('section')
        const scrollAmount = 232 * 4

        Object.keys(anime_sections).forEach(section => {
            let anime_section_wrapper = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper')
            let anime_section_list = Object.values(anime_sections)[section].querySelector('.anime-list')
            let anime_section_scroll_left = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[0]
            let anime_section_scroll_right = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[1]

            let disableButtons = () => {
                let maxScroll = anime_section_list.scrollWidth - anime_section_wrapper.clientWidth

                if (anime_section_wrapper.scrollLeft == 0) {
                    anime_section_scroll_left.classList.add('disabled')
                } else {
                    anime_section_scroll_left.classList.remove('disabled')
                }

                if (anime_section_wrapper.scrollLeft == maxScroll) {
                    anime_section_scroll_right.classList.add('disabled')
                } else {
                    anime_section_scroll_right.classList.remove('disabled')
                }
            }

            // if section is too small, hde scrolling buttons
            let doHideButtons = () => {
                if (anime_section_wrapper.clientWidth > anime_section_list.scrollWidth) return true; else return false
            }

            // update scroll value
            anime_section_scroll_left.addEventListener('click', () => {
                anime_section_wrapper.scrollLeft -= scrollAmount
                setTimeout(() => {
                    disableButtons()
                }, 600)
            })

            anime_section_scroll_right.addEventListener('click', () => {
                anime_section_wrapper.scrollLeft += scrollAmount
                setTimeout(() => {
                    disableButtons()
                }, 600)
            })

            // show
            let showButtons = () => {
                if (doHideButtons()) return
                disableButtons()

                anime_section_scroll_left.classList.remove('hide-opacity')
                anime_section_scroll_right.classList.remove('hide-opacity')
                anime_section_scroll_left.classList.add('show-opacity')
                anime_section_scroll_right.classList.add('show-opacity')
            }

            // hide
            let hideButtons = () => {
                anime_section_scroll_left.classList.remove('show-opacity')
                anime_section_scroll_right.classList.remove('show-opacity')
                anime_section_scroll_left.classList.add('hide-opacity')
                anime_section_scroll_right.classList.add('hide-opacity')
            }

            // anime_section_wrapper.addEventListener('mouseover', showButtons)
            Object.values(anime_sections)[section].addEventListener('mouseenter', showButtons)
            // anime_section_scroll_left.addEventListener('mouseover', showButtons)
            // anime_section_scroll_right.addEventListener('mouseover', showButtons)

            // anime_section_wrapper.addEventListener('mouseout', hideButtons)
            Object.values(anime_sections)[section].addEventListener('mouseleave', hideButtons)
            // anime_section_scroll_left.addEventListener('mouseout', hideButtons)
            // anime_section_scroll_right.addEventListener('mouseout', hideButtons)
        })
    }

    /**
     * Displays the auto update modal page
     */
    displayAutoUpdatePage() {
        this.showModalPage('auto-update-page-shadow-background', 'auto-update-page')
    }

    /**
     * Closes the auto update modal page
     */
    closeAutoUpdatePage() {
        this.hideModalPage('auto-update-page-shadow-background', 'auto-update-page')
    }

    /**
     * Displays the settings modal page
     */
    displaySettingsPage() {
        this.showModalPage('settings-page-shadow-background', 'settings-page')
    }

    /**
     * Closes the settings modal page
    */
    closeSettingsPage() {
        this.hideModalPage('settings-page-shadow-background', 'settings-page')
    }

    /**
     * Displays the list editor modal page
     */
    displayListEditorPage(animeId) {
        // display current infos (if present)
        const status = document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data .persdata-anime-user-status`).innerHTML
        const progress = parseInt(document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data .persdata-anime-user-progress`).innerHTML)
        const score = parseInt(document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data .persdata-anime-user-score`).innerHTML)
        const availableEpisodes = parseInt(document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data .persdata-anime-available-episodes`).innerHTML)

        // console.log('--- DATA ---')
        // console.log('status', status)
        // console.log('progress', progress)
        // console.log('score', score)

        status == ""
            ? document.getElementById('list-editor-user-list').value = ""
            : document.getElementById('list-editor-user-list').value = status

        document.getElementById('list-editor-progress').setAttribute('max', availableEpisodes)
        progress == 0
            ? document.getElementById('list-editor-progress').value = 0
            : document.getElementById('list-editor-progress').value = progress

        score == -1
            ? document.getElementById('list-editor-score').value = 0
            : document.getElementById('list-editor-score').value = score

        // console.log('--- CHANGED DATA ---')
        // console.log('status', document.getElementById('list-editor-user-list').value)
        // console.log('progress', document.getElementById('list-editor-progress').value)
        // console.log('score', document.getElementById('list-editor-score').value)

        // display the limit of episodes (/24, /12...) and score (/10)
        document.querySelector('#list-editor-progress-limit .value').innerHTML = progress
        document.querySelector('#list-editor-progress-limit .limit').innerHTML = availableEpisodes

        document.querySelector('#list-editor-score-limit .value').innerHTML = score
        document.querySelector('#list-editor-score-limit .limit').innerHTML = 10

        // console.log('\n\n')
        // console.log(document.getElementById('list-editor-user-list').value)
        // console.log(document.getElementById('list-editor-progress').value)
        // console.log(document.getElementById('list-editor-score').value)

        this.showModalPage('list-editor-page-shadow-background', 'list-editor-page')
    }

    /**
     * Shows the VERY COOL wheel value above score/progress inputs in list-editor modal page
     * 
     * @param {*} type 
     */
    showListEditorInputValue(type) {
        let output = document.getElementById(`list-editor-${type}-value`)
        let value = document.getElementById(`list-editor-${type}`).value
        let limit = document.querySelector(`#list-editor-${type}-limit .limit`).innerHTML

        output.value = value
        output.style.left = 100 * value / limit + '%'
        // output.style.left = 'calc(' + (100 * value / limit + '%') + ' - ' +  (output.offsetWidth + 'px') +')'
    }

    /**
     * Closes the list editor modal page
     */
    closeListEditorPage() {
        this.hideModalPage('list-editor-page-shadow-background', 'list-editor-page')
    }

    /**
     * Displays an anime section (with anime entries from viewer lists)
     * 
     * @param {*} entries 
     * @param {*} list the viewer list (current, completed...)
     * @returns -1 if entries is empty
     */
    displayUserAnimeSection(entries, list, needProgressBar) {
        var anime_list_div = document.getElementById(list)
        anime_list_div.innerHTML = ""

        // if(Object.values(entries).length == 0) return -1

        try {
            Object.keys(entries).forEach(key => {
                var anime_entry_div = this.createAnimeSectionEntry(entries[key].media)

                if (needProgressBar) {
                    // append a shadow layer to the card
                    let anime_cover_div = anime_entry_div.getElementsByClassName('anime-cover')[0]
                    let anime_cover_shadow = document.createElement('div')
                    anime_cover_shadow.classList.add('anime-cover-shadow')
                    anime_cover_div.appendChild(anime_cover_shadow)

                    // append the progress bar to the card
                    // this.appendProgressBar(
                    //         anime_entry_div.getElementsByClassName('anime-cover')[0],
                    //         this.getEpisodes(entries[key].media),
                    //         entries[key].progress
                    //     )
                }
                anime_list_div.appendChild(anime_entry_div)
            })
        } catch (error) {
            console.log(`${list} not loaded`)
            console.log(error)
        }
    }

    /**
     * Displays an anime section (with anime entries from genres)
     * 
     * @param {*} entries
     * @param {*} genre
     */
    displayGenreAnimeSection(entries, genre) {
        var anime_list_div = document.getElementById(genre)
        anime_list_div.innerHTML = ""

        try {
            Object.keys(entries.media).forEach(key => {
                var anime_entry_div = this.createAnimeSectionEntry(Object.values(entries.media)[key])
                anime_list_div.appendChild(anime_entry_div)
            })
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Appends a bar showing the user progress
     * 
     * @param {*} div 
     * @param {*} episodes 
     * @param {*} progress 
     */
    appendProgressBar(div, episodes, progress) {
        var progressWidth

        if (episodes != '?') progressWidth = 100 * progress / episodes
        else progressWidth = 0

        let bar_div = document.createElement('div')
        let progress_bar_div = document.createElement('div')

        bar_div.classList.add('bar')
        progress_bar_div.classList.add('progress-bar')
        progress_bar_div.style.width = `${progressWidth}%`

        bar_div.appendChild(progress_bar_div)
        div.appendChild(bar_div)
    }

    /**
     * Appends a stars row showing the user score
     * 
     * @param {*} div 
     * @param {*} score 
     */
    appendScoreStars(div, score) {
        const max = 10

        for (let i = 1; i <= max; i += 2) {
            if (i < score) {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-solid fa-star"></i>'
            } else if (i === score) {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-regular fa-star-half-stroke"></i>'
            } else {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-regular fa-star"></i>'
            }
        }
    }

    /**
     * Creates the anime section entry div
     * 
     * @param {*} animeEntry 
     * @returns anime entry DOM element
     */
    createAnimeSectionEntry(animeEntry) {
        const animeId = animeEntry.id
        const animeName = this.getTitle(animeEntry)
        const seasonYear = this.getParsedSeasonYear(animeEntry)
        const format = this.getParsedFormat(animeEntry.format)
        const cover = animeEntry.coverImage.large
        const status = animeEntry.status

        let anime_entry_div = document.createElement('div')
        let anime_cover_div = document.createElement('div')
        let anime_cover_img = document.createElement('img')
        let anime_title_div = document.createElement('div')
        let anime_info_div = document.createElement('div')
        let seasonYear_div = document.createElement('div')
        let episodes_div = document.createElement('div')
        let anime_entry_content = document.createElement('div')

        anime_entry_div.classList.add('anime-entry')
        anime_cover_div.classList.add('anime-cover')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        seasonYear_div.classList.add('seasonYear')
        episodes_div.classList.add('episodes')
        anime_entry_content.classList.add('content')

        anime_entry_div.id = ('anime-entry-' + animeId)

        if (status === 'RELEASING') {
            let span_div = document.createElement('span')
            span_div.innerHTML = '<i style="margin-right: 5px" class="fa-regular fa-circle-dot"></i>'

            anime_title_div.appendChild(span_div)
            anime_title_div.innerHTML += animeName
        } else {
            anime_title_div.innerHTML = animeName
        }

        seasonYear_div.innerHTML = `<i style="margin-right: 5px" class="fa-regular fa-calendar"></i>`
        seasonYear_div.innerHTML += seasonYear
        episodes_div.innerHTML = format
        episodes_div.innerHTML += `<i style="margin-left: 5px" class="fa-solid fa-display"></i>`
        anime_cover_img.src = cover
        anime_cover_img.alt = 'cover'

        let overlay_div = this.createEntryOverlay(animeEntry)
        this.createAnimePage(animeEntry)

        anime_cover_div.appendChild(anime_cover_img)
        anime_entry_content.appendChild(anime_title_div)
        anime_info_div.appendChild(seasonYear_div)
        anime_info_div.appendChild(episodes_div)
        anime_entry_content.appendChild(anime_info_div)
        // anime_entry_div.appendChild(overlay_div)
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(anime_entry_content)

        anime_entry_div.classList.add('show')
        return anime_entry_div
    }

    createEntryOverlay(animeEntry) {
        let overlay_div = document.createElement('div')
        let img_wrapper_div = document.createElement('div')
        let img_div = document.createElement('img')
        let content_div = document.createElement('div')
        let title_div = document.createElement('div')
        let info_div = document.createElement('div')
        let description_div = document.createElement('div')

        const banner = animeEntry.bannerImage
        const title = this.getTitle(animeEntry)
        const description = this.parseDescription(animeEntry.description)

        overlay_div.classList.add('overlay')
        img_wrapper_div.classList.add('ov-img-wrapper')
        content_div.classList.add('ov-content')
        title_div.classList.add('ov-title')
        info_div.classList.add('ov-info')
        description_div.classList.add('ov-description')

        img_div.src = banner
        title_div.innerHTML = title
        description_div.innerHTML = description

        img_wrapper_div.appendChild(img_div)
        content_div.appendChild(title_div)
        content_div.appendChild(info_div)
        content_div.appendChild(description_div)
        overlay_div.appendChild(img_wrapper_div)
        overlay_div.appendChild(content_div)

        return overlay_div
    }

    /**
     * Creates the anime page with the passed content
     * 
     * @param {*} animeEntry 
     */
    createAnimePage(animeEntry) {
        // display episodes
        let displayEpisodes = animeId => {
            // episode 27/165 -> 027/165
            let padEpisodeNumber = (episode) => {
                return String(episode).padStart(String(episodes).length, '\xa0');
            }

            // create a select element to switch episode pages
            let createSelectEpisodes = () => {
                let select = document.createElement('select')
                select.classList.add('main-select-0')
                select.id = `select-episodes-page-${id}`

                // create section options
                for (let i = 0; i < nPages; i++) {
                    let from = padEpisodeNumber(episodesPerPage * i + 1)
                    let to = padEpisodeNumber(episodesPerPage * (i + 1))
                    let option = document.createElement('option')

                    option.value = `${i + 1}`
                    episodes > to
                        ? option.innerHTML = `${from} - ${to}`
                        : option.innerHTML = `${from} - ${episodes}`

                    select.appendChild(option)
                }

                return select
            }

            let episodes_section = document.createElement('div')
            let episodes_scroller = document.createElement('div')
            let episodes_options = document.createElement('div')
            let header = document.createElement('h2')
            let select = createSelectEpisodes()
            // let separator_div = document.createElement('div')

            episodes_section.classList.add('episodes-section')
            episodes_scroller.classList.add('episodes-scroller')
            episodes_options.classList.add('episodes-options')
            header.innerHTML = 'Episodes'
            // separator_div.classList.add('separator')
            // separator_div.innerHTML = 'Episodes'

            episodes_options.appendChild(header)
            if (episodes > episodesPerPage) episodes_options.appendChild(select)
            episodes_scroller.appendChild(episodes_options)

            let createEpisodesPage = (i) => {
                let episodes_div = document.createElement('div')
                episodes_div.id = `episodes-${parseInt(i / episodesPerPage) + 1}`
                episodes_div.classList.add('episodes')

                return episodes_div
            }

            // create episodes entries
            for (let i = 1; i <= episodes; i++) {
                if (i === 1) {
                    var episodes_div = createEpisodesPage(1)
                    episodes_div.classList.add('show')
                }
                let episode_entry = document.createElement('div')
                let episode_img = document.createElement('img')
                let episode_content = document.createElement('div')
                let episode_title = document.createElement('div')
                let episode_info = document.createElement('div')
                let episode_description = document.createElement('div')

                episode_entry.id = `episode-${id}-${i}` // pattern: episode-animeid-episodenumber
                episode_entry.classList.add('episode-entry')
                episode_content.classList.add('episode-content')
                episode_title.classList.add('title')
                episode_info.classList.add('info')
                episode_description.classList.add('description')
                episode_img.src = banner
                episode_img.alt = 'No image available'
                episode_title.innerHTML = `Episode ${i}`
                episode_description.innerHTML = ''

                episode_content.appendChild(episode_title)
                episode_content.appendChild(episode_info)
                episode_content.appendChild(episode_description)
                episode_entry.appendChild(episode_img)
                episode_entry.appendChild(episode_content)
                episodes_div.appendChild(episode_entry)

                if (i % episodesPerPage == 0) {
                    episodes_scroller.appendChild(episodes_div)
                    var episodes_div = createEpisodesPage(i)
                }
            }

            if (episodes_div) episodes_scroller.appendChild(episodes_div)

            // episodes_section.appendChild(separator_div)
            if (!this.isAnimeNotAvailable(animeEntry)) episodes_section.appendChild(episodes_scroller)
            content_wrapper.appendChild(episodes_section)
        }

        let appendWatchButtons = () => {
            let watch_buttons = document.createElement('div')
            let watch_buttons_1 = document.createElement('button')
            let watch_buttons_2 = document.createElement('button')

            watch_buttons.classList.add('watch-buttons')
            watch_buttons_1.classList.add('main-button-0')

            if (progress == 0) {
                watch_buttons_1.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-play"></i>`
                watch_buttons_1.innerHTML += `Start watching`
                watch_buttons_1.id = `watch-${id}-${1}`
                watch_buttons_1.classList.remove('disabled')
                watch_buttons_1.removeAttribute('disabled')
            } else if (progress == episodes) {
                watch_buttons_1.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-rotate"></i>`
                watch_buttons_1.innerHTML += `Watch again`
                watch_buttons_1.id = `watch-${id}-${1}`
                watch_buttons_1.classList.remove('disabled')
                watch_buttons_1.removeAttribute('disabled')
            } else if (progress == availableEpisodes) {
                watch_buttons_1.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-hourglass"></i>`
                watch_buttons_1.innerHTML += `${timeUntilAiring.days}d ${timeUntilAiring.hours}h ${timeUntilAiring.minutes}m`
                watch_buttons_1.classList.add('disabled')
                watch_buttons_1.setAttribute('disabled', '')
            } else {
                watch_buttons_1.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-play"></i>`
                watch_buttons_1.innerHTML += `Resume from Ep. ${progress + 1}`
                watch_buttons_1.id = `watch-${id}-${progress + 1}`
                watch_buttons_1.classList.remove('disabled')
                watch_buttons_1.removeAttribute('disabled')
            }

            pers_data_10.innerHTML = `${timeUntilAiring.days}d ${timeUntilAiring.hours}h ${timeUntilAiring.minutes}m`

            watch_buttons_2.classList.add('main-button-0')

            if (userStatus == "") {
                watch_buttons_2.classList.add('not-in-list')
                watch_buttons_2.innerHTML = `<i class="fa-regular fa-bookmark"></i>`
            } else {
                watch_buttons_2.classList.add('in-list')
                watch_buttons_2.innerHTML = `<i class="fa-solid fa-check"></i>`
            }

            if (this.isAnimeNotAvailable(animeEntry)) watch_buttons_1.style.display = 'none'
            watch_buttons.appendChild(watch_buttons_1)
            watch_buttons.appendChild(watch_buttons_2)
            banner_wrapper.appendChild(watch_buttons)
        }

        // colors
        let style = getComputedStyle(document.body)
        const colorImportant = style.getPropertyValue('--color-important')
        const colorSuccess = style.getPropertyValue('--color-success')
        const colorAlert = style.getPropertyValue('--color-alert')
        const colorWarning = style.getPropertyValue('--color-warning')

        // anilist data
        const id = animeEntry.id
        const title = this.getTitle(animeEntry)
        const status = this.getParsedStatus(animeEntry.status)
        const format = this.getParsedFormat(animeEntry.format)
        const episodes = this.getEpisodes(animeEntry)
        const availableEpisodes = this.getAvailableEpisodes(animeEntry)
        const description = this.parseDescription(animeEntry.description)
        const banner = animeEntry.bannerImage
        const trailerUrl = this.getTrailerUrl(animeEntry)
        const season = this.capitalizeFirstLetter(animeEntry.season)
        const seasonYear = this.getParsedSeasonYear(animeEntry)
        const genres = Object.values(animeEntry.genres).join(', ')
        const synonyms = Object.values(animeEntry.synonyms).join(', ')
        const animeTitles = this.getTitlesAndSynonyms(animeEntry)
        const meanScore = this.getMeanScore(animeEntry)
        const duration = animeEntry.duration
        const progress = this.getProgress(animeEntry)
        const userStatus = this.getUserStatus(animeEntry)
        const score = this.getScore(animeEntry)
        const mediaListId = this.getMediaListId(animeEntry)
        const timeUntilAiring = this.getTimeUntilAiring(animeEntry)

        // if this anime page already exists, do not create a useless clone of it
        if (document.getElementById(`anime-page-${id}`)) return

        const episodesPerPage = 30
        const nPages = parseInt(episodes / episodesPerPage) + 1

        // dom elements
        let anime_pages = document.querySelector('.anime-pages')

        let pers_data = document.createElement('ul')
        let pers_data_1 = document.createElement('li')
        let pers_data_2 = document.createElement('li')
        let pers_data_3 = document.createElement('li')
        let pers_data_4 = document.createElement('li')
        let pers_data_5 = document.createElement('li')
        let pers_data_6 = document.createElement('li')
        let pers_data_7 = document.createElement('li')
        let pers_data_8 = document.createElement('li')
        let pers_data_9 = document.createElement('li')
        let pers_data_10 = document.createElement('li')
        let modal_page_wrapper = document.createElement('div')
        let anime_page = document.createElement('div')
        let exit_button = document.createElement('button')
        let content_wrapper = document.createElement('div')
        let banner_wrapper = document.createElement('div')
        let banner_img = document.createElement('img')
        let banner_video = document.createElement('iframe')
        let content_div = document.createElement('div')
        let left_div = document.createElement('div')
        let title_div = document.createElement('h1')
        let info_div = document.createElement('ul')
        let info_1 = document.createElement('li')
        let info_2 = document.createElement('li')
        let info_3 = document.createElement('li')
        let info_4 = document.createElement('li')
        let info_5 = document.createElement('li')
        let description_div = document.createElement('div')
        let show_more_description_div = document.createElement('span')
        let right_div = document.createElement('div')
        let attidional_info_1 = document.createElement('p')
        let attidional_info_2 = document.createElement('p')
        let attidional_info_3 = document.createElement('p')
        let additional_info_span = document.createElement('span')

        // classes, ids, innerHTMLs, src...
        modal_page_wrapper.id = `anime-page-${id}`
        pers_data.classList.add('persistent-data')
        pers_data_1.classList.add('persdata-anime-titles')
        pers_data_2.classList.add('persdata-anime-id')
        pers_data_3.classList.add('persdata-anime-available-episodes')
        pers_data_4.classList.add('persdata-anime-user-status')
        pers_data_5.classList.add('persdata-anime-user-progress')
        pers_data_6.classList.add('persdata-anime-user-score')
        pers_data_7.classList.add('persdata-anime-episodes')
        pers_data_8.classList.add('persdata-anime-media-list-id')
        pers_data_9.classList.add('persdata-anime-are-episodes-loaded')
        pers_data_10.classList.add('persdata-time-before-airing')
        modal_page_wrapper.classList.add('modal-page-wrapper')
        modal_page_wrapper.classList.add('fade-in')
        anime_page.classList.add('anime-page')
        exit_button.id = `exit-${id}`
        exit_button.classList.add('exit')
        exit_button.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        content_wrapper.classList.add('content-wrapper')
        banner_wrapper.classList.add('banner-wrapper')
        banner_img.classList.add('banner')
        banner_video.classList.add('banner')
        banner_video.setAttribute('loading', 'lazy')
        banner_video.setAttribute('frameBorder', 0)
        // banner_video.setAttribute('autoplay', '')
        content_div.classList.add('content')
        left_div.classList.add('left')
        title_div.classList.add('title')
        info_div.classList.add('info')
        description_div.classList.add('description')
        description_div.classList.add('cropped')
        show_more_description_div.classList.add('show-more')
        show_more_description_div.classList.add('show-element')
        right_div.classList.add('right')
        attidional_info_1.classList.add('additional-info')
        attidional_info_2.classList.add('additional-info')
        attidional_info_3.classList.add('additional-info')

        Object.keys(animeTitles).forEach(title => {
            let anime_title_div = document.createElement('p')
            anime_title_div.innerHTML = Object.values(animeTitles)[title]
            pers_data_1.appendChild(anime_title_div)
        })

        pers_data_2.innerHTML = id
        pers_data_3.innerHTML = availableEpisodes
        pers_data_4.innerHTML = userStatus
        pers_data_5.innerHTML = progress
        pers_data_6.innerHTML = score
        pers_data_7.innerHTML = episodes
        pers_data_8.innerHTML = mediaListId
        pers_data_9.innerHTML = 0
        banner_img.src = banner
        banner_video.src = trailerUrl
        title_div.innerHTML = title

        switch (status) {
            case 'Finished':
                info_1.innerHTML = `<i style="margin-right: 7px" class="fa-regular fa-circle-check"></i>`
                break
            case 'Releasing':
                info_1.innerHTML = `<i style="margin-right: 7px" class="fa-regular fa-circle-dot"></i>`
                info_1.style.color = colorSuccess
                break
            case 'Unreleased':
                info_1.innerHTML = `<i style="margin-right: 7px" class="fa-regular fa-clock"></i>`
                info_1.style.color = colorAlert
                break
            case 'Cancelled':
            case 'Discontinued':
                info_1.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-ban"></i>`
                info_1.style.color = colorWarning
                break
        }

        info_1.innerHTML += status

        info_2.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-display"></i>`
        info_2.innerHTML += format

        if (format === 'Movie') {
            info_3.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-stopwatch"></i>`
            info_3.innerHTML += `${duration} Minutes`
        } else {
            info_3.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-film"></i>`
            info_3.innerHTML += availableEpisodes

            if (status === 'Releasing') {
                info_3.innerHTML += ` / ${episodes}`
            }

            info_3.innerHTML += ' Episodes'
        }

        info_4.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-star"></i>`
        info_4.innerHTML += `${meanScore}%`
        info_4.style.color = colorAlert

        info_5.innerHTML = '<i style="margin-right: 7px" class="fa-solid fa-circle-exclamation"></i>'
        info_5.innerHTML += 'Adults'
        info_5.style.color = colorImportant

        description_div.innerHTML = description
        show_more_description_div.innerHTML = `Show more`
        show_more_description_div.innerHTML += `<i style="margin-left: 5px" class="fa-solid fa-angle-down"></i>`

        additional_info_span.innerHTML = 'Released on: '
        attidional_info_1.appendChild(additional_info_span)
        attidional_info_1.innerHTML += season + ' ' + seasonYear
        additional_info_span.innerHTML = 'Genres: '
        attidional_info_2.appendChild(additional_info_span)
        attidional_info_2.innerHTML += genres
        additional_info_span.innerHTML = 'Other titles: '
        attidional_info_3.appendChild(additional_info_span)
        attidional_info_3.innerHTML += synonyms

        // appending

        // trailerUrl == ''
        //     ? banner_wrapper.appendChild(banner_img)
        //     : banner_wrapper.appendChild(banner_video)

        if (banner == null) banner_img.style.display = 'none'
        banner_wrapper.appendChild(banner_img)

        if (this.store.get('logged')) {
            appendWatchButtons()
        }

        if (animeEntry.isAdult) info_div.appendChild(info_5)
        info_div.appendChild(info_4)
        info_div.appendChild(info_1)
        info_div.appendChild(info_2)
        info_div.appendChild(info_3)
        left_div.appendChild(title_div)
        left_div.appendChild(info_div)
        left_div.appendChild(description_div)
        left_div.appendChild(show_more_description_div)
        right_div.appendChild(attidional_info_1)
        right_div.appendChild(attidional_info_2)
        right_div.appendChild(attidional_info_3)
        content_div.appendChild(left_div)
        content_div.appendChild(right_div)
        content_wrapper.appendChild(banner_wrapper)
        content_wrapper.appendChild(content_div)
        displayEpisodes()

        pers_data.appendChild(pers_data_1)
        pers_data.appendChild(pers_data_2)
        pers_data.appendChild(pers_data_3)
        pers_data.appendChild(pers_data_4)
        pers_data.appendChild(pers_data_5)
        pers_data.appendChild(pers_data_6)
        pers_data.appendChild(pers_data_7)
        pers_data.appendChild(pers_data_8)
        pers_data.appendChild(pers_data_9)
        pers_data.appendChild(pers_data_10)
        anime_page.appendChild(pers_data)
        anime_page.appendChild(exit_button)
        anime_page.appendChild(content_wrapper)
        modal_page_wrapper.appendChild(anime_page)

        anime_pages.appendChild(modal_page_wrapper)
    }

    /**
     * Trigger to display the anime overlay
     * 
     * @param {*} event 
     */
    triggerAnimeOverlay(event) {
        let showOrHideOverlay = (entry) => {
            if (entry.querySelector('.overlay') === null) return

            let overlay_div = entry.querySelector('.overlay')
            let oldIndex = parseInt(entry.style.zIndex)
            oldIndex += 2

            // entry.style.zIndex = oldIndex

            overlay_div.classList.add('show-overlay')
            overlay_div.classList.add('show-overlay-delay')

            overlay_div.addEventListener('mouseout', () => {
                let oldIndex = parseInt(entry.style.zIndex)
                oldIndex -= 2

                // entry.style.zIndex -= oldIndex

                overlay_div.classList.remove('show-overlay')
                overlay_div.classList.remove('show-overlay-delay')
            })
        }

        if (!(event.target.classList.contains('anime-entry'))) {
            var entry = event.target.closest('.anime-entry')
            if (entry) {
                showOrHideOverlay(entry)
            }
        } else {
            // showOrHideOverlay(event.target)
        }
    }

    /**
     * Trigger to display the anime modal page opened from the featured section
     * 
     * @param {*} event 
     */
    triggerFeaturedAnime(event) {
        if (!(event.target.tagName == 'button')) {
            var entry = event.target.closest('button')
            if (entry) {
                this.displayAnimePage(this.getIdFromFeaturedAnime(entry))
            }
        } else {
            this.displayAnimePage(this.getIdFromFeaturedAnime(event.target))
        }
    }

    /**
     * Displays the featured anime
     * 
     * @param {*} animeEntry
     */
    displayFeaturedAnime(entries) {
        var featured_scroller_wrapper_div = document.getElementsByClassName('featured-scroller-wrapper')[0]
        featured_scroller_wrapper_div.innerHTML = ''
        var width = 0

        try {
            entries.media.forEach(key => {
                var featured_div = this.createAnimeFeaturedEntry(key)
                if (featured_div != -1) {
                    featured_scroller_wrapper_div.appendChild(featured_div)
                    width += 100
                }
            })

            featured_scroller_wrapper_div.style.width = (width + '%')
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Create a featured anime entry
     * 
     * @param {*} animeEntry 
     * @returns featured anime entry div | -1 if no banner is present
     */
    createAnimeFeaturedEntry(animeEntry) {
        const banner = animeEntry.bannerImage
        if (banner == null) return -1 // if there is no banner, do not display this anime

        const id = animeEntry.id
        const title = this.getTitle(animeEntry)
        const episodes = this.getEpisodes(animeEntry)
        const season = this.capitalizeFirstLetter(animeEntry.season)
        const seasonYear = this.getParsedSeasonYear(animeEntry)
        const description = this.parseDescription(animeEntry.description)

        var featured_div = document.createElement('div')
        var featured_container_div = document.createElement('div')
        var featured_img_div = document.createElement('div')
        var featured_img = document.createElement('img')
        var content_div = document.createElement('div')
        var anime_title_div = document.createElement('div')
        var anime_info_div = document.createElement('div')
        var anime_description_div = document.createElement('div')
        var featured_anime_button = document.createElement('button')
        var anime_year_div = document.createElement('div')
        var anime_episodes_div = document.createElement('div')

        featured_div.classList.add('featured')
        featured_container_div.classList.add('featured-container')
        featured_img_div.classList.add('featured-img')
        content_div.classList.add('content')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        anime_description_div.classList.add('anime-description')
        anime_year_div.classList.add('anime-year')
        anime_episodes_div.classList.add('anime-episodes')
        featured_anime_button.id = 'featured-anime-button-'
        featured_anime_button.id += id
        featured_anime_button.innerHTML = 'See More'
        featured_anime_button.classList.add('main-button-0')
        anime_title_div.innerHTML = title
        anime_year_div.innerHTML = season + ' ' + seasonYear
        anime_episodes_div.innerHTML = episodes + " Episodes"
        anime_description_div.innerHTML = description
        featured_img.src = banner

        anime_info_div.appendChild(anime_year_div)
        anime_info_div.innerHTML += '•'
        anime_info_div.appendChild(anime_episodes_div)
        content_div.appendChild(anime_info_div)
        content_div.appendChild(anime_title_div)
        content_div.appendChild(anime_description_div)
        content_div.appendChild(featured_anime_button)
        featured_container_div.appendChild(content_div)
        featured_div.appendChild(featured_container_div)
        featured_img_div.appendChild(featured_img)
        featured_div.appendChild(featured_img_div)

        content_div.classList.add('show')

        return featured_div
    }

    /**
     * Displays the viewer avatar
     * 
     * @param {*} userInfo 
     */
    displayViewerAvatar(userInfo) {
        document.getElementById('user-icon').src = userInfo.User.avatar.large
        /* document.getElementById('user-name').innerHTML += userInfo.User.name */
    }

    /**
     * Searchs for anime with filters
     */
    async searchAnimeWithFilter() {
        let title = document.getElementById('search-page-filter-title').value
        let genre = document.getElementById('search-page-filter-genre').value
        let season = document.getElementById('search-page-filter-season').value
        let year = document.getElementById('search-page-filter-year').value
        let format = document.getElementById('search-page-filter-format').value
        // let status = document.getElementById('search-page-filter-status').value
        let status = ''
        let sort = document.getElementById('search-page-filter-sort').value

        // let tags_container = document.querySelector('main .search-buttons-container .search-tags .tags-container')
        // tags_container.innerHTML = ''

        let args = [
            title != '' ? title = `search: "${title}"`
                : title = '',
            genre != '' ? genre = `genre: "${genre}"`
                : genre = '',
            season != '' ? season = `season: ${season}`
                : season = '',
            year != '' ? year = `seasonYear: ${year}`
                : year = '',
            format != '' ? format = `format: ${format}`
                : format = '',
            status != '' ? status = `status: ${status}`
                : status = '',
            sort != '' ? sort = `sort: ${sort}`
                : sort = ''
        ].filter(item => !(item == ''))

        for (let i = 0; i < args.length; i++) {
            let tag = document.createElement('div')
            tag.classList.add('tag')
            tag.innerHTML = args[i]

            // tags_container.appendChild(tag)
        }

        args = args.concat('type: ANIME').join(', ')

        let entries = await this.anilist.searchFilteredAnime(args)
        let entries_container_div = document.querySelector('.entries-container')

        entries_container_div.innerHTML = ''

        Object.keys(entries.media).forEach(key => {
            var anime_entry_div = this.createAnimeSectionEntry(Object.values(entries.media)[key])

            entries_container_div.appendChild(anime_entry_div)
        })
    }

    /**
     * Trigger to display the anime modal page opened from an anime section
     * 
     * @param {*} event 
     */
    triggerAnimeModal(event) {
        if (!(event.target.classList.contains('anime-entry'))) {
            var entry = event.target.closest('.anime-entry')
            if (entry) {
                this.displayAnimePage(this.getIdFromAnimeEntry(entry))
            }
        } else {
            this.displayAnimePage(this.getIdFromAnimeEntry(event.target))
        }
    }

    /**
     * Displays the anime modal page
     * 
     * @param {*} animeId 
    */
    async displayAnimePage(animeId) {
        if (animeId == -1) return

        this.showModalPage('anime-page-shadow-background', `anime-page-${animeId}`)

        // show more description trigger
        let show_more_description_div = document.querySelector(`#anime-page-${animeId} .show-more`)
        let description_div = document.querySelector(`#anime-page-${animeId} .left .description`)

        if (!this.isEllipsisActive(description_div)) show_more_description_div.classList.remove('show-element')

        show_more_description_div.addEventListener('click', () => {
            description_div.classList.remove('cropped')
            show_more_description_div.classList.remove('show-element')
        })

        // let trailer_iframe = document.querySelector(`#anime-page-${animeId} iframe`)
        // trailer_iframe.src += '?autoplay=1&controls=0'

        // storing anime persistend data
        let pers_data = document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data`)
        let pers_data_common = document.getElementById('persistent-data-common')
        pers_data_common.innerHTML = pers_data.innerHTML

        // display episodes with data
        await this.displayEpisodesData(animeId)

        // close anime page from button
        let anime_page_exit_button = document.querySelector(`#anime-page-${animeId} .anime-page button[id^="exit-"]`)
        anime_page_exit_button.addEventListener('click', () => {
            this.closeAnimePage()
        })

        // close anime page from clicking outside
        document.getElementById(`anime-page-${animeId}`).addEventListener('click', (event) => {
            if (!(event.target.closest(`#anime-page-${animeId} .anime-page .content-wrapper`))) {
                this.closeAnimePage()
            }
        })

        // episodes pages switch
        let episodes_page_select = document.querySelector(`#anime-page-${animeId} .episodes-options select`)
        episodes_page_select?.addEventListener('change', () => {
            this.changeEpisodesPage(animeId, episodes_page_select.value)
        })

        // trigger video when click episode entry
        let episodes = document.querySelectorAll(`#anime-page-${animeId} .anime-page .episodes`)
        Object.keys(episodes).forEach(episode => {
            let episode_section = Object.values(episodes)[episode]

            episode_section.addEventListener('click', (event) => {
                this.triggerEpisode(event)
            })
        })

        // trigger video when click watch buttons
        let watch_button_1 = document.querySelector(`#anime-page-${animeId} .anime-page .watch-buttons`).firstChild
        watch_button_1.addEventListener('click', () => {
            this.video.displayVideo(watch_button_1.id)
        })

        // list editor
        let watch_button_2 = document.querySelector(`#anime-page-${animeId} .anime-page .watch-buttons`).lastChild
        watch_button_2.addEventListener('click', () => {
            this.displayListEditorPage(animeId)
            this.showListEditorInputValue('progress')
            this.showListEditorInputValue('score')
        })
    }

    changeEpisodesPage(animeId, page) {
        let episodes_to_hide = document.querySelector(`#anime-page-${animeId} .anime-page .episodes.show`)
        let episodes_to_show = document.querySelectorAll(`#anime-page-${animeId} .anime-page .episodes`)[page - 1]

        episodes_to_hide.classList.remove('show')
        episodes_to_show.classList.add('show')
    }

    async displayEpisodesData(animeId) {
        let parseAirdate = airdate => `${airdate.split('-')[2]} ${this.months[airdate.split('-')[1]]} ${airdate.split('-')[0]}`

        let areEpisodesLoaded = document.querySelector(`#anime-page-${animeId} .persdata-anime-are-episodes-loaded`)
        if (areEpisodesLoaded.innerHTML == 1) return
        areEpisodesLoaded.innerHTML = 1

        try {
            const episodesEntries = await this.req.makeRequest("GET", `${this.episodesInfourl}${animeId}`,)
            let episode_entries_div = document.querySelectorAll(`#anime-page-${animeId} .episode-entry`)

            for (let i = 0; i < Object.keys(episode_entries_div).length; i++) {
                let entry = episode_entries_div[i]
                let episodeData = episodesEntries.episodes[(parseInt(i) + 1)]

                if (episodeData.title.en !== undefined) {
                    entry.querySelector('.title').innerHTML = episodeData.title.en
                    let span = document.createElement('span')
                    span.innerHTML = `Ep. ${parseInt(i) + 1} - `
                    entry.querySelector('.title').prepend(span)
                }
                if (episodeData.airdate !== undefined) {
                    let span = document.createElement('span')
                    span.innerHTML = `<i style="margin-right: 7px" class="fa-regular fa-calendar"></i>`
                    span.innerHTML += parseAirdate(episodeData.airdate)
                    entry.querySelector('.info').appendChild(span)
                }
                if (episodeData['length'] !== undefined) {
                    let span = document.createElement('span')
                    span.innerHTML = `<i style="margin-right: 7px" class="fa-solid fa-stopwatch"></i>`
                    span.innerHTML += `${episodeData['length']}min`
                    entry.querySelector('.info').appendChild(span)
                }
                if (episodeData.summary !== undefined)
                    entry.querySelector('.description').innerHTML = episodeData.summary
                if (episodeData.image !== undefined)
                    entry.querySelector('img').src = episodeData.image
            }
        } catch (error) {
            console.log(error)
        }
    }


    async getSeasonEpisodeList({ animeId, episode }) {
        try {
            const episodesList = await this.req.makeRequest("GET", `${this.episodesInfourl}${animeId}`,)
            let listContent = '';

            if (Object.keys(episodesList).length === 0) {
                return;
            }

            Object.entries(episodesList.episodes).forEach(([key, value]) => {
                if (key <= episodesList.episodeCount) {
                    // TODO support for translation
                    listContent += `<li data-episode="` + this.setEpisodeDataAtt(value.episodeNumber, parseInt(value.episode), animeId) + `" class="` + this.getActiveEpisode(value.episodeNumber, parseInt(value.episode), episode) + `">` + this.getEpisodeTitle(value.title.en) +
                        `</li>`;

                    // NOTE conflicted whether to show summary or not
                    // listContent += `<li data-episode="`+this.setEpisodeDataAtt(value.episodeNumber, animeId)+`" class="`+this.getActiveEpisode(value.episodeNumber, episode)+`">`+this.getEpisodeTitle(value.title.en)+
                    // `<p>`+this.showDescOnActiveEp(value.episodeNumber, episode, value.summary)+`</p></li>`;
                }
            });

            const epElem = document.getElementById('ep_list_content');
            if (epElem) {
                epElem.innerHTML = listContent;
            }

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Return if the anime page is displayed or not
     * 
     * @returns true if the anime page is displayed, false otherwise
     */
    isAnimePageDisplayed() {
        const animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML
        return document.getElementById(`anime-page-${animeId}`)?.style.display == 'flex'
    }

    /**
     * Return title or coming message if not released yet
     * 
     * @returns "title or coming.." message if not released yet
     */
    getEpisodeTitle(title) {
        return title !== null ? title : 'coming..';
    }

    /**
     * Return episode-anime to be set as attribute
     * 
     * @returns "episodeId-animeId"
     */
    setEpisodeDataAtt(episode, episodeAlt, anime) {
        return `${episode || episodeAlt}-${anime}`;
    }

    /**
     * Return an active class if the playing episode is matched
     * 
     * @returns "active" if the playing episode is matched
     */
    getActiveEpisode(listEp, listEpAlt, openedEp) {
        const oEp = listEp || listEpAlt;
        return oEp === openedEp ? 'active' : '';
    }

    /**
     * Return summary if the playing episode is matched
     * 
     * @returns "summary" if the playing episode is matched
     */
    showDescOnActiveEp(listEp, openedEp, description) {
        return openedEp === listEp ? description : '';
    }

    /**
     * Return if the list editor page is displayed or not
     * 
     * @returns true if the list editor page is displayed, false otherwise
     */
    isListEditorDisplayed() {
        return document.getElementById('list-editor-page')?.style.display == 'flex'
    }

    /**
     * Return if the settings page is displayed or not
     * 
     * @returns true if the settings page is displayed, false otherwise
     */
    isSettingsPageDisplayed() {
        return document.getElementById('settings-page')?.style.display == 'flex'
    }

    /**
     * Return if the video page is displayed or not
     * 
     * @returns true if the video page is displayed, false otherwise
     */
    isVideoPageDisplayed() {
        return document.querySelector('.container')?.style.display == 'block'
    }

    /**
     * List editor: you can create or change a entry status, progress and score in one of your lists
     * 
     * @returns if some form inputs are incorrect
     */
    listEditorSave() {
        const availableEpisodes = parseInt(document.querySelector(`#persistent-data-common .persdata-anime-available-episodes`).innerHTML)
        let warn = 0

        let userList = document.getElementById('list-editor-user-list')
        if (userList.value == "") {
            let userListContainer = document.getElementById('list-editor-user-list-container')
            this.listEditorWarn(userListContainer)
            warn = 1
        }

        let userProgress = document.getElementById('list-editor-progress')
        if (userProgress.value < 0 || userProgress.value > availableEpisodes) {
            let useProgressContainer = document.getElementById('list-editor-progress-container')
            this.listEditorWarn(useProgressContainer)
            warn = 1
        } else if (userProgress.value == "") {
            userProgress.value = 0
        }

        if (userList.value === "COMPLETED") {
            userProgress.value = availableEpisodes
        }

        let userScore = document.getElementById('list-editor-score')
        if (userScore.value < 0 || userScore.value > 10) {
            let userScoreContainer = document.getElementById('list-editor-score-container')
            this.listEditorWarn(userScoreContainer)
            warn = 1
        } else if (userScore.value == "") {
            userScore.value = 0
        }

        if (warn) return

        const animeId = parseInt(document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML)
        console.log(animeId + ' ' +
            userList.value + ' ' +
            userScore.value * 10 + ' ' +
            userProgress.value)

        this.anilist.updateAnimeFromList(animeId,
            userList.value,
            userScore.value * 10,
            userProgress.value)

        this.video.updateDataAndWatchButtons(parseInt(animeId),
            parseInt(userProgress.value),
            userList.value,
            parseInt(userScore.value))

        this.closeListEditorPage()
    }

    /**
     * If a form input is not correct, warn the user
     * 
     * @param {*} div to warn
    */
    listEditorWarn(div) {
        div.classList.remove('user-list-warn-off')
        div.classList.add('user-list-warn-on')

        setTimeout(() => {
            div.classList.remove('user-list-warn-on')
            div.classList.add('user-list-warn-off')
        }, 400)
    }

    /**
     * Closes the list editor modal page
     */
    listEditorDelete() {
        const mediaListId = parseInt(document.querySelector('#persistent-data-common .persdata-anime-media-list-id').innerHTML)
        const animeId = parseInt(document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML)
        let watch_buttons_2 = document.querySelector(`#anime-page-${animeId} .anime-page .watch-buttons`).lastChild

        this.anilist.deleteAnimeFromList(mediaListId)

        watch_buttons_2.classList.remove('in-list')
        watch_buttons_2.classList.add('not-in-list')
        watch_buttons_2.innerHTML = `<i class="fa-regular fa-bookmark"></i>`

        this.closeListEditorPage()
    }

    /**
     * Closes anime page
     * 
     * @param {*} id 
     */
    closeAnimePage() {
        const animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML

        if (animeId) {
            if (localStorage.getItem("seasonInfo") !== null) {
                localStorage.removeItem("seasonInfo");
            }
            // WIP: trailers in anime page
            // let trailer_iframe = document.querySelector(`#anime-page-${animeId} iframe`)
            // trailer_iframe.src = ''

            this.hideModalPage('anime-page-shadow-background', `anime-page-${animeId}`)

            // WIP: scrollTop 0 when closing an anime page
            // setTimeout(() => {
            //     document.querySelector(`#anime-page-${animeId} .content-wrapper`).scrollTop = 0
            // }, 400)
        }
    }

    /**
     * Trigger for the video played from the episode div list
     * 
     * @param {*} event 
     */
    triggerEpisode(event) {
        if (!(event.target.classList.contains('episode-entry'))) {
            var entry = event.target.closest('.episode-entry')
            if (entry) {
                this.video.displayVideo(entry.id)
            }
        } else {
            this.video.displayVideo(event.target.id)
        }
    }

    /**
     * Returns the anime entry id
     * 
     * @param {*} div 
     * @returns 
     */
    getIdFromAnimeEntry = div => div.id.slice(12)

    /**
     * Returns the episode entry id
     * 
     * @param {*} div 
     * @returns 
     */
    getIdFromEpisodeEntry = div => div.id.slice(8)

    /**
     * Returns the featured anime id
     * 
     * @param {*} div 
     * @returns 
     */
    getIdFromFeaturedAnime = div => div.id.slice(22)

    /**
     * Gets the anime title (english or romaji)
     * 
     * @param {*} animeEntry 
     * @returns title
     */
    getTitle = animeEntry => animeEntry.title.english == null
        ? animeEntry.title.romaji
        : animeEntry.title.english

    /**
     * Gets english, romaji and synonyms and combines them into an array
     * 
     * @param {*} animeEntry 
     * @returns anime titles
     */
    getTitlesAndSynonyms(animeEntry) {
        let animeTitles = []

        if (animeEntry.title.romaji != null) animeTitles.push(animeEntry.title.romaji)
        if (animeEntry.title.english != null) animeTitles.push(animeEntry.title.english)

        animeTitles = animeTitles.concat(Object.values(animeEntry.synonyms))

        return animeTitles
    }

    /**
     * Gets the anime episodes number from 'episodes' or 'nextAiringEpisode'
     * 
     * @param {*} animeEntry 
     * @returns episodes number
     */
    getEpisodes = animeEntry => animeEntry.episodes == null
        ? animeEntry.nextAiringEpisode == null
            ? '?'
            : animeEntry.nextAiringEpisode.episode - 1
        : animeEntry.episodes

    /**
     * Gets the anime available episodes number from 'episodes' or 'nextAiringEpisode'
     * 
     * @param {*} animeEntry 
     * @returns available episodes number
     */
    getAvailableEpisodes = animeEntry => animeEntry.nextAiringEpisode == null
        ? animeEntry.episodes == null
            ? '?'
            : animeEntry.episodes
        : animeEntry.nextAiringEpisode.episode - 1

    /**
     * Gets an anime mean score
     * 
     * @param {*} animeEntry 
     * @returns anime mean score
     */
    getMeanScore = animeEntry => animeEntry.meanScore == null
        ? '?'
        : animeEntry.meanScore

    /**
     * Gets the anime user status
     * 
     * @param {*} animeEntry 
     * @returns user status
     */
    getUserStatus = animeEntry => animeEntry.mediaListEntry == null
        ? ""
        : animeEntry.mediaListEntry.status

    /**
     * Gets the user anime score
     * 
     * @param {*} animeEntry 
     * @returns anime score
     */
    getScore = animeEntry => animeEntry.mediaListEntry == null
        ? -1
        : animeEntry.mediaListEntry.score

    /**
     * Gets the user anime progress
     * 
     * @param {*} animeEntry 
     * @returns anime progress
     */
    getProgress = animeEntry => animeEntry.mediaListEntry == null
        ? 0
        : animeEntry.mediaListEntry.progress

    /**
     * Returns whether an anime is available or not
     * 
     * @param {*} animeEntry 
     * @returns 
     */
    isAnimeNotAvailable = animeEntry => this.getParsedStatus(animeEntry.status) == 'Unreleased' || this.getParsedStatus(animeEntry.status) == 'Cancelled'
        ? true
        : false

    /**
     * Returns an object containing how much time remains before the next episode airs
     * 
     * @param {*} animeEntry 
     * @returns 
     */
    getTimeUntilAiring = animeEntry => {
        if (animeEntry.nextAiringEpisode == null) return -1

        let seconds = parseInt(animeEntry.nextAiringEpisode.timeUntilAiring)
        let days = Math.floor(seconds / (3600 * 24))

        seconds -= days * 3600 * 24
        let hours = Math.floor(seconds / 3600)

        seconds -= hours * 3600
        let minutes = Math.floor(seconds / 60)

        seconds -= minutes * 60

        return {
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }

    }

    getMediaListId = animeEntry => animeEntry.mediaListEntry == null
        ? -1
        : animeEntry.mediaListEntry.id

    /**
     * Gets the trailer url
     * 
     * @param {*} animeEntry 
     * @returns 
     */
    getTrailerUrl = animeEntry => animeEntry.trailer == null
        ? ""
        : animeEntry.trailer.site == 'youtube'
            ? `https://www.youtube.com/embed/${animeEntry.trailer.id}`
            : ""

    /**
     * Removes unwanted spaces/new lines from anime description
     * 
     * @param {*} description 
     * @returns parsed description
     */
    parseDescription = description => description == null
        ? ""
        : description.replace('<br>', '')

    /**
     * Parses anime status into a better human-readable name
     * 
     * @param {*} status 
     * @returns 
     */
    getParsedStatus = status => {
        switch (status) {
            case 'FINISHED':
                return 'Finished'
            case 'RELEASING':
                return 'Releasing'
            case 'NOT_YET_RELEASED':
                return 'Unreleased'
            case 'CANCELLED':
                return 'Cancelled'
            case 'HIATUS':
                return 'Discontinued'
        }
    }

    /**
     * Parses anime format into a better human-readable name
     * 
     * @param {*} status 
     * @returns 
     */
    getParsedFormat = format => {
        switch (format) {
            case 'TV':
                return 'TV Show'
            case 'TV_SHORT':
                return 'TV Short'
            case 'MOVIE':
                return 'Movie'
            case 'SPECIAL':
                return 'Special'
            case 'OVA':
                return 'OVA'
            case 'ONA':
                return 'ONA'
            case 'MUSIC':
                return 'Music'
            default:
                return '?'
        }
    }

    /**
     * Return '?' if there is no season year
     * 
     * @param {*} animeEntry 
     * @returns 
     */
    getParsedSeasonYear = animeEntry => animeEntry.seasonYear == null
        ? '?'
        : animeEntry.seasonYear

    /**
     * Capitalizes the first letter of a string
     * 
     * @param {*} string 
     * @returns parsed string
     */
    capitalizeFirstLetter = string => string == null
        ? ""
        : string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1)

    /**
     * Returns whether a div is cropped (with -webkit-line-clamp) or not 
     * 
     * @param {*} div 
     * @returns 
     */
    isEllipsisActive = div => div.scrollHeight > div.clientHeight
}
