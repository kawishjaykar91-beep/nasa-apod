import './style.css'

const APOD_URL = 'https://api.nasa.gov/planetary/apod'
const app = document.querySelector('#app')
const apiKey = import.meta.env.VITE_NASA_API_KEY

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

function renderPageShell(bodyHtml) {
  return `
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
      </header>
      <div class="apod-panel">
        ${bodyHtml}
      </div>
    </main>
  `
}

function showLoading() {
  app.innerHTML = renderPageShell(`
    <div class="apod-loading" role="status" aria-live="polite">
      <div class="apod-spinner" aria-hidden="true"></div>
      <p class="apod-loading-text">Fetching today&apos;s picture from NASA…</p>
    </div>
  `)
}

function showError(message) {
  app.innerHTML = renderPageShell(`
    <div class="apod-error" role="alert">
      <p class="apod-error-title">Unable to load APOD</p>
      <p class="apod-error-message">${escapeHtml(message)}</p>
    </div>
  `)
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
        Watch today&apos;s video
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
  const copyrightBlock = apod.copyright
    ? `<footer class="apod-footer"><p class="apod-copyright">© ${escapeHtml(apod.copyright)}</p></footer>`
    : ''

  const displayDate = formatDisplayDate(apod.date)

  app.innerHTML = renderPageShell(`
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
  `)

  const imageFigure = app.querySelector('.apod-media--image')
  if (imageFigure) {
    initApodImage(imageFigure)
  }
}

async function loadApod() {
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

    const response = await fetch(requestUrl)

    if (!response.ok) {
      throw new Error(
        `Could not load today's picture (HTTP ${response.status}). Try again in a moment.`,
      )
    }

    const apod = await response.json()
    showApod(apod)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while loading today's picture."
    showError(message)
  }
}

loadApod()
