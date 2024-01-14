import {Get} from "@/config/http";

const base = "/chirp/feed-service"
export const getPage = (page) => {
    return Get({
        url: `${base}/feed`,
        params: {page}
    })
}
export const getPageByScore = (score) => {
  return Get({
      url:`${base}/feed/score/${score}`
  })
}
export const getRange = (start, end) => {
    return Get({
        url: `${base}/feed`,
        params: {start, end}
    })
}
