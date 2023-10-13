import {FormPost, Get, JsonPost} from "@/config/http";

const base="/chirp/advice-service/";
export const getPage = (page) => {
  return Get({
      url:`${base}notice/page`,
      params:{page}
  })
}
export const getUnreadCount = () => {
  return Get({
      url:`${base}notice/count/unread`
  })
}
export const markAsRead = (data) => {
  return Get({
      url:`${base}notice/read/mark`
  })
}

