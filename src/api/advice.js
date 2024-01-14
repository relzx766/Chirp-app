import {FormPost, Get, JsonPost} from "@/config/http";

const base = "/chirp/advice-service/";
export const getPage = (offset) => {
    return Get({
        url: `${base}notice/page/${offset}`
    })
}
export const getUnreadCount = () => {
    return Get({
        url: `${base}notice/count/unread`
    })
}
export const markAsRead = (data) => {
    return Get({
        url: `${base}notice/read/mark`
    })
}

export const getChatIndexPage = () => {
    return Get({
        url: `${base}chat/index`
    })
}
export const getChatHistory = (senderId, page) => {
    return Get({
        url: `${base}chat/history/page/${page}/${senderId}`
    })
}
export const getChatUnread = (conversations) => {
    let date = new FormData();
    date.append("conversations", conversations);
    return FormPost({
        url: `${base}chat/unread/get`,
        data: date
    })
}
/**
 * 将该话题所有消息标记为已读
 * @param conversationIds 话题id，数组类型
 */
export const markConversationRead = (conversationIds) => {
    let data = new FormData();
    data.append("conversations", conversationIds)
    return FormPost({
        url: `${base}chat/read/mark`,
        data: data
    })
}
export const markAsDel = (id) => {
  return Get({
      url:`${base}chat/delete/mark/${id}`
  })
}
export const leaveConv = (id) => {
  return Get({
      url:`${base}chat/leave/${id}`
  })
}
export const getKeyPair = () => {
  return Get({
      url:`${base}e2ee/pair`
  })
}
export const savePublicKey = (key) => {
    let data=new FormData();
    data.append("key",key);
  return FormPost({
      url:`${base}e2ee`,
      data:data
  })
}
export const fetchPublicKey = (id) => {
  return Get(
    {
        url:`${base}e2ee/key/${id}`
    })

}
export const getPublicKeys = (ids) => {
  return JsonPost({
      url:`${base}e2ee/keys`,
      data:ids
  })
}
export const getChatSetting = (id) => {
  return Get({
      url:`${base}chat/setting/${id}`
  })
}
export const getChatSettings = (id) => {
  return JsonPost({
      url:`${base}/chat/setting/multi`,
      data:id
  })
}
export const updateAllow = (allow) => {
    let data=new FormData();
    data.append("allow",allow)
  return FormPost({
      url:`${base}/chat/setting/allow`,
      data:data
  })
}
export const updatePinned = (conversation) => {
    let data=new FormData();
    data.append("conversation",conversation);
    return FormPost({
        url:`${base}/chat/setting/pinned`,
        data:data
    })
}
export const getMyChatSetting = () => {
  return Get({
      url:`${base}/chat/setting`
  })
}