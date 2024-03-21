'use-strict'

const Video = require('../modules/frontend/video')
const Store = require('electron-store')
const video = new Video()
const store = new Store()

const container = document.querySelector(".container")
const shadowControls = container.getElementsByClassName('shadow-controls')[0],
mainVideo = document.getElementById("video"),
videoTitle = document.getElementById('video-title'),
videoEpisodeTitle = document.getElementById('video-episode-title'),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".video-progress-bar"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
skipForwardSmall = container.querySelector(".skip-forward-small i"),
skipForwardSmallText = container.querySelector(".skip-forward-small span"),
playPauseBtn = container.querySelector(".play-pause i"),
nextEpisodeBtn = container.querySelector(".next"),
exitBtn = container.querySelector('.exit-video'),
pictureInPicture = container.querySelector('.pic-in-pic'),
volumeBtn = container.querySelector(".volume i"),
settingsBtn = container.querySelector(".settings i"),
settingsOptions = container.querySelector(".settings-options"),
volumeRange = container.querySelector(".volume input"),
playbackSelect = container.querySelector(".playback select"),
introSkipTime = container.querySelector(".intro-skip-time select"),
fullScreenBtn = container.querySelector(".fullscreen i"),
// dynamic video settings options
dynamicSettingsUpdateProgress = document.getElementById('dynamic-settings-update-progress'),
dynamicSettingsUpdateProgressSlider = document.getElementById('dynamic-settings-update-progress-slider'),
dynamicSettingsDubbed = document.getElementById('dynamic-settings-dubbed'),
dynamicSettingsAutoNext = document.getElementById('dynamic-settings-auto-next'),
dynamicSettingsLanguage = document.getElementById('dynamic-settings-language'),
// settings options
updateProgressCheckbox = document.getElementById('update-progress-checkbox'),
dubbedCheckbox = document.getElementById('dubbed-checkbox'),
languageSelect = document.getElementById('language-select')

// variables
let timer
let updated = false /* to update anime progress automatically */
let canUpdate = store.get('update_progress')

const setVolume = value => {
    mainVideo.volume = value;
    volumeRange.value = value;
    store.set('video_volume', value)
}

const getVolume = () => store.get('video_volume')

const setPlayback = value => {
    mainVideo.playbackRate = value
    playbackSelect.value = value
    store.set('video_playback', value)
}

const getPlayback = () => store.get('video_playback')

const setIntroSkipTime = value => {
    introSkipTime.value = value
    skipForwardSmallText.textContent = value
    store.set('intro_skip_time', value)
}

const getIntroSkipTime = () => store.get('intro_skip_time')


// stored data load
getVolume()
    ? setVolume(parseFloat(store.get('video_volume')))
    : setVolume(0.5)

if (getVolume() == 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
}

getPlayback()
    ? setPlayback(store.get('video_playback'))
    : setPlayback(1)

getIntroSkipTime()
    ? setIntroSkipTime(store.get('intro_skip_time'))
    : setIntroSkipTime(85)

// controls
const hideControls = () => {
    if (settingsOptions.classList.contains("show-options"))
        return

    timer = setTimeout(() => {
        container.classList.remove("show-controls")
        shadowControls.classList.remove('show-cursor')
    }, 2000)
}

hideControls()

// dynamic settings options
const reloadVideoAtPreviousTime = () => {
    let animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML
    let n = document.querySelector('#video-episode').innerHTML

    video.displayVideo(`episode-${animeId}-${n}`, mainVideo.currentTime)
}

if (!store.get('logged')) {
    dynamicSettingsUpdateProgress.setAttribute('disabled', '')
    dynamicSettingsUpdateProgressSlider.classList.add('disabled')
}

dynamicSettingsUpdateProgress.addEventListener('change', () => {
    canUpdate = dynamicSettingsUpdateProgress.checked
    store.set('update_progress', dynamicSettingsUpdateProgress.checked)

    updateProgressCheckbox.checked = dynamicSettingsUpdateProgress.checked
})

dynamicSettingsDubbed.addEventListener('change', () => {
    dynamicSettingsDubbed.checked == true
        ? store.set('dubbed', true)
        : store.set('dubbed', false)

    reloadVideoAtPreviousTime()

    dubbedCheckbox.checked = dynamicSettingsDubbed.checked
})

dynamicSettingsAutoNext.addEventListener('change', () => {
    dynamicSettingsAutoNext.checked == true
        ? store.set('auto-next', true)
        : store.set('auto-next', false)
})

dynamicSettingsLanguage.addEventListener('change', () => {
    store.set('source_flag', dynamicSettingsLanguage.value)

    reloadVideoAtPreviousTime()

    languageSelect.value = dynamicSettingsLanguage.value
})

// pause info
var pauseTimer
const showPauseInfo = () => {
    clearTimeout(pauseTimer)

    if (settingsOptions.classList.contains("show-options"))
        return

    pauseTimer = setTimeout(() => {
        if (mainVideo.paused && mainVideo.currentTime != 0) {
            container.classList.add('show-pause-info')
        }
    }, 7500)
}

const hidePauseInfo = () => {
    container.classList.remove('show-pause-info')
}

mainVideo.addEventListener('pause', () => {
    container.addEventListener("mousemove", (event) => {
        showPauseInfo()
    });
})

mainVideo.addEventListener('pause', () => {
    showPauseInfo()
})

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
    shadowControls.classList.add('show-cursor')
    clearTimeout(timer)
    hideControls()
    hidePauseInfo()
})

const formatTime = time => {
    if (!time || time === NaN) {
        return '00:00';
    }

    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600)
    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours
    if (hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth
    let offsetX = e.offsetX
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration)
    const progressTime = videoTimeline.querySelector("span")
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX
    progressTime.style.left = `${offsetX}px`
    progressTime.innerText = formatTime(percent)
})

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth
    let currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    progressBar.style.width = `${(currentTime / mainVideo.duration) * 100}%`
    mainVideo.currentTime = currentTime
})

mainVideo.addEventListener("timeupdate", e => {
    let { currentTime, duration } = e.target
    progressBar.style.width = `${(currentTime / duration) * 100}%`
    currentVidTime.innerText = formatTime(currentTime)
})

mainVideo.addEventListener("timeupdate", () => {
    videoDuration.innerText = formatTime(mainVideo.duration - mainVideo.currentTime)
})

mainVideo.addEventListener("ended", async () => {
    if (store.get('auto-next') == true) {
        await video.nextEpisode()
        updated = false
    }
})


const togglePictureInPicture = () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        mainVideo.requestPictureInPicture();
    }
}


const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    currentVidTime.innerText = formatTime(mainVideo.currentTime)
}

volumeRange.addEventListener("input", e => {
    setVolume(e.target.value)

    if (e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
})

playbackSelect.addEventListener('change', () => {
    setPlayback(playbackSelect.value)
})

introSkipTime.addEventListener('change', () => {
    setIntroSkipTime(introSkipTime.value)
})

fullScreenBtn.addEventListener("click", () => {
    toggleFullScreen()
})

pictureInPicture.addEventListener("click", () => {
    togglePictureInPicture()
})

exitBtn.addEventListener("click", () => {
    updated = false
    mainVideo.pause()
    mainVideo.currentTime = 0
    videoDuration.innerText = '00:00'
    mainVideo.src = null
    videoTitle.innerHTML = ''
    videoEpisodeTitle.innerHTML = ''
    container.style.display = 'none'
    if (document.fullscreenEnabled) {
        document.exitFullscreen()
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
    }
})

mainVideo.addEventListener('play', () => {
    setPlayback(getPlayback())
})

mainVideo.addEventListener("click", (event) => {
    if (event.target !== this)
        return
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
})

container.addEventListener("click", (event) => {
    // do not hide if press settings icon or settings options
    if (event.target == settingsBtn) return
    if (event.target.closest('.settings-options')) return

    settingsOptions.classList.remove('show-options')
})

// fullscreen when double click
mainVideo.addEventListener('dblclick', (event) => {
    if (event.target !== event.currentTarget) return;
    toggleFullScreen()
})

shadowControls.addEventListener("click", (event) => {
    if (event.target !== event.currentTarget) return;
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
})

shadowControls.addEventListener('dblclick', (event) => {
    if (event.target !== event.currentTarget) return;
    toggleFullScreen()
})

videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar))
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar))
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause())
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"))
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"))
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5)
skipForward.addEventListener("click", () => mainVideo.currentTime += 5)
skipForwardSmall.addEventListener("click", () => mainVideo.currentTime += Number(getIntroSkipTime()));

nextEpisodeBtn.addEventListener("click", async () => {
    await video.nextEpisode()
    updated = false
})

settingsBtn.addEventListener("click", () => {
    settingsOptions.classList.toggle("show-options")
})

/* trigger auto updating episode when the user reaches the 80% of the anime */
mainVideo.addEventListener('timeupdate', () => {
    if (canUpdate) console.log(mainVideo.currentTime * 100 / mainVideo.duration)
    if (mainVideo.currentTime * 100 / mainVideo.duration > 80
        && !updated && canUpdate) {
        updated = true
        video.updateAnimeProgress()
    }
})

document.addEventListener("keydown", async (event) => {
    if (event.isComposing || event.keyCode === 229)
        return

    if (videoIsDisplayed()) {
        switch (event.code) {
            case 'Space': {
                event.preventDefault();

                mainVideo.paused ? mainVideo.play() : mainVideo.pause()
                hidePauseInfo()
                break
            }
            case 'ArrowLeft': {
                event.preventDefault();

                mainVideo.currentTime -= 5
                break
            }
            case 'ArrowUp': {
                event.preventDefault();

                setVolume(getVolume() + 0.1)
                break
            }
            case 'ArrowRight': {
                event.preventDefault();

                mainVideo.currentTime += 5
                break
            }
            case 'ArrowDown': {
                event.preventDefault();

                setVolume(getVolume() - 0.1)
                break
            }
            case 'F11': {
                event.preventDefault();

                toggleFullScreen()
                break
            }
        }
        switch (event.key) {
            case 'f': {
                event.preventDefault();

                toggleFullScreen()
                break
            }
            case 'm': {
                event.preventDefault();

                toggleMute()
                break
            }
            case 'n': {
                event.preventDefault();

                await video.nextEpisode()
                updated = false
                break
            }
        }
    }
})

function videoIsDisplayed() {
    if (container.style.display == 'block')
        return true

    return false
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")

        return document.exitFullscreen()
    }

    container.classList.toggle("fullscreen")
    fullScreenBtn.classList.replace("fa-expand", "fa-compress")
    container.requestFullscreen()
}

function toggleMute() {
    if (mainVideo.volume == 0 && videoIsDisplayed) {
        // mainVideo.volume = volumeBtn.dataset.volume;
        // volumeRange.value = volumeBtn.dataset.volume;
        setVolume(volumeBtn.dataset.volume)
        volumeBtn.setAttribute('data-volume', 0)
        return volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    } else {
        volumeBtn.setAttribute('data-volume', mainVideo.volume)
        // mainVideo.volume = 0;
        // volumeRange.value = 0;
        setVolume(0)
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }

}
