import dayjs from "dayjs"

export const getDocuments = (collection) => {
  return collection && collection.docs && collection.docs.map(v => v.data())
}

export const latestDayReducerFromMaxDisplayTime = (a, c) => {
  const day_a = dayjs.unix(a.max_display_time.seconds)
  const day_c = dayjs.unix(c.max_display_time.seconds)
  return day_c.isAfter(day_a) ? c : a
}
