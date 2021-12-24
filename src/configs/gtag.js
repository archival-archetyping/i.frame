export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, label, value }) => {
  window.gtag('event', action, {
    event_category: 'engagement',
    event_label: label,
    value: value,
  })
}
