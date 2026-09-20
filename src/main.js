import './style.css'

const APOD_URL = 'https://api.nasa.gov/planetary/apod'
const app = document.querySelector('#app')
const apiKey = import.meta.env.VITE_NASA_API_KEY

// -- State & Constants --
const NASA_START_DATE = '1995-06-16'
let currentDisplayedDate = null

// -- Utilities --
function escapeHtml(text) {
  const el = document.createElement('span')
  el.textContent = text
  return el.innerHTML
}

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getTodayString() {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - (offset * 60 * 1000))
  return localDate.toISOString().split('T')[0]
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - (offset * 60 * 1000))
  return localDate.toISOString().split('T')[0]
}

// -- Rendering --

function initShell() {
  app.innerHTML = `
    <div class="space-scene" aria-hidden="true">
      <div class="space-stars space-stars--far"></div>
      <div class="space-stars space-stars--near"></div>
      <div class="space-glow"></div>
    </div>
    <main class="apod">
      <header class="apod-hero">
        <p class="apod-eyebrow">NASA · Planetary Science</p>
        <h1 class="apod-title">Astronomy Picture of the Day</h1>
        <p class="apod-lede">Explore the universe through NASA&apos;s daily featured image and video.</p>

        <nav class="apod-navigation" aria-label="APOD Date Selection">
          <button class="apod-nav-button" id="nav-prev" aria-label="Previous Day">← PREVIOUS</button>
          <div class="apod-date-wrapper">
            <label class="visually-hidden" for="nav-date">Select APOD date</label>
            <input type="date" id="nav-date" class="apod-date-input" min="${NASA_START_DATE}" max="${getTodayString()}">
          </div>
          <button class="apod-nav-button" id="nav-today">TODAY</button>
          <button class="apod-nav-button" id="nav-next" aria-label="Next Day">NEXT →</button>
        </nav>
      </header>
      <div class="apod-panel" id="apod-panel" aria-live="polite">
      </div>
    </main>
  `
}

function getPanel() {
  return document.getElementById('apod-panel')
}

function setControlsEnabled(enabled) {
  const prev = document.getElementById('nav-prev')
  const dateInput = document.getElementById('nav-date')
  const today = document.getElementById('nav-today')
  const next = document.getElementById('nav-next')

  if (!prev || !dateInput || !today || !next) return

  prev.disabled = !enabled
  dateInput.disabled = !enabled
  today.disabled = !enabled

  if (!enabled) {
    next.disabled = true
  } else {
    const todayStr = getTodayString()
    next.disabled = currentDisplayedDate >= todayStr
  }
}

function syncControls(dateString) {
  const dateInput = document.getElementById('nav-date')
  if (dateInput && dateString) {
    dateInput.value = dateString
  }

  setControlsEnabled(true)
}

function showLoading() {
  const panel = getPanel()
  if (!panel) return
  setControlsEnabled(false)
  panel.innerHTML = `
    <div class="apod-loading" role="status">
      <div class="apod-spinner" aria-hidden="true"></div>
      <p class="apod-loading-text">Fetching picture from NASA…</p>
    </div>
  `
}

function showError(message) {
  const panel = getPanel()
  if (!panel) return
  setControlsEnabled(true)
  panel.innerHTML = `
    <div class="apod-error" role="alert">
      <p class="apod-error-title">Unable to load APOD</p>
      <p class="apod-error-message">${escapeHtml(message)}</p>
    </div>
  `
}

function buildMediaMarkup(apod) {
  if (apod.media_type === 'video') {
    const videoUrl = apod.url
    const youtubeMatch = videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
    )

    if (youtubeMatch) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
      return `<iframe
        class="apod-video"
        src="${escapeHtml(embedUrl)}"
        title="${escapeHtml(apod.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>`
    }

    return `<p class="apod-video-link">
      <a class="apod-button" href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer">
        Watch video
      </a>
    </p>`
  }

  const imageUrl = apod.hdurl || apod.url
  return `
    <div class="apod-media-frame">
      <div class="apod-media-skeleton" aria-hidden="true"></div>
      <img
        class="apod-image"
        src="${escapeHtml(imageUrl)}"
        alt="${escapeHtml(apod.title)}"
        loading="eager"
        decoding="async"
      />
    </div>
  `
}

function initApodImage(figure) {
  const frame = figure.querySelector('.apod-media-frame')
  const img = figure.querySelector('.apod-image')
  if (!frame || !img) return

  const markLoaded = () => {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      frame.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`
    }
    frame.classList.add('is-loaded')
    img.classList.add('is-loaded')
  }

  if (img.complete && img.naturalWidth > 0) {
    markLoaded()
    return
  }

  img.addEventListener('load', markLoaded, { once: true })
  img.addEventListener(
    'error',
    () => {
      frame.classList.add('is-error')
    },
    { once: true },
  )
}

function showApod(apod) {
  const panel = getPanel()
  if (!panel) return

  const copyrightBlock = apod.copyright
    ? `<footer class="apod-footer"><p class="apod-copyright">© ${escapeHtml(apod.copyright)}</p></footer>`
    : ''

  const displayDate = formatDisplayDate(apod.date)

  panel.innerHTML = `
    <article class="apod-content">
      <header class="apod-header">
        <time class="apod-date" datetime="${escapeHtml(apod.date)}">${escapeHtml(displayDate)}</time>
        <h2 class="apod-heading">${escapeHtml(apod.title)}</h2>
      </header>
      <figure class="apod-media${apod.media_type === 'image' ? ' apod-media--image' : ''}">
        ${buildMediaMarkup(apod)}
      </figure>
      <div class="apod-body">
        <p class="apod-explanation">${escapeHtml(apod.explanation)}</p>
        ${copyrightBlock}
      </div>
    </article>
  `

  const imageFigure = panel.querySelector('.apod-media--image')
  if (imageFigure) {
    initApodImage(imageFigure)
  }
}

// -- Logic & Data Fetching --

async function loadApod(targetDate, isHistoryPop = false) {
  showLoading()

  if (!apiKey) {
    showError(
      'Missing API key. Copy .env.example to .env and set VITE_NASA_API_KEY.',
    )
    return
  }

  try {
    const requestUrl = new URL(APOD_URL)
    requestUrl.searchParams.set('api_key', apiKey)

    if (targetDate) {
      requestUrl.searchParams.set('date', targetDate)
    }

    const response = await fetch(requestUrl)

    if (!response.ok) {
      let errorMsg = `Could not load picture (HTTP ${response.status}). Try again in a moment.`
      try {
        const errorData = await response.json()
        if (errorData.msg) {
          errorMsg = errorData.msg
        }
      } catch (e) {}
      throw new Error(errorMsg)
    }

    const apod = await response.json()

    currentDisplayedDate = apod.date

    if (!isHistoryPop) {
      const url = new URL(window.location)
      if (currentDisplayedDate === getTodayString()) {
        url.searchParams.delete('date')
      } else {
        url.searchParams.set('date', currentDisplayedDate)
      }
      history.pushState({ date: currentDisplayedDate }, '', url)
    }

    syncControls(currentDisplayedDate)
    showApod(apod)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading the picture."
    showError(message)
  }
}

// -- Initialization & Events --

function initApp() {
  initShell()

  const prevBtn = document.getElementById('nav-prev')
  const nextBtn = document.getElementById('nav-next')
  const todayBtn = document.getElementById('nav-today')
  const dateInput = document.getElementById('nav-date')

  prevBtn.addEventListener('click', () => {
    if (currentDisplayedDate) {
      loadApod(addDays(currentDisplayedDate, -1))
    }
  })

  nextBtn.addEventListener('click', () => {
    if (currentDisplayedDate) {
      loadApod(addDays(currentDisplayedDate, 1))
    }
  })

  todayBtn.addEventListener('click', () => {
    loadApod(getTodayString())
  })

  dateInput.addEventListener('change', (e) => {
    if (e.target.value) {
      loadApod(e.target.value)
    }
  })

  window.addEventListener('popstate', (e) => {
    const params = new URLSearchParams(window.location.search)
    const date = params.get('date')
    loadApod(date || getTodayString(), true)
  })

  const params = new URLSearchParams(window.location.search)
  const initialDate = params.get('date')

  history.replaceState({ date: initialDate || getTodayString() }, '', window.location.href)

  loadApod(initialDate)
}

initApp()
