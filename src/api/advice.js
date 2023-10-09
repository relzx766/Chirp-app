import {FormPost, Get} from "@/config/http";

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
export const markAsRead = (messageId) => {
    let data=new FormData();
    data.append("messageId",messageId);
  return FormPost({
      url:`${base}notice/read/mark`,
      data:data
  })
}
