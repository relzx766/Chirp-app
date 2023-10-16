import {Get} from "@/config/http";

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

