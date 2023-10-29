import {FormPost, Get} from "@/config/http";

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
