import {FormPost, Get, JsonPost} from "@/config/http";

const sever = '/chirp/chirper-service';
export const getDetail = (id) => {
    return Get({
        url: sever + "/chirper/detail",
        params: {id}
    })
}
export const getByIds = (ids) => {
    let data = new FormData();
    data.append("ids", ids)
    return FormPost({
        url: `${sever}/chirper/page/id`,
        data: data
    })
}
export const getChirperPage = (page) => {
    return Get({
        url: sever + "/chirper/page",
        params: {page}
    })
}
export const doLike = (id) => {
    return JsonPost({
        url: sever + '/like/give',
        data: {
            chirperId: id
        }
    })
}
export const cancelLike = (id) => {
    return JsonPost({
        url: sever + "/like/cancel",
        data: {
            chirperId: id
        }
    })
}
export const postChirper = (text, mediaKeys) => {
    return JsonPost({
        url: sever + '/chirper/add',
        data: {
            text,
            mediaKeys
        }
    })
}
export const forwardChirper = (id) => {
    let data = new FormData();
    data.append("chirperId", id)
    return FormPost({
        url: sever + "/chirper/forward",
        data: data
    })
}
export const cancelForward = (id) => {
    let data = new FormData();
    data.append("chirperId", id);
    return FormPost({
        url: sever + "/chirper/forward/cancel",
        data: data
    })
}
export const quoteChirper = (text, referencedChirperId, mediaKeys) => {
    return JsonPost({
        url: sever + "/chirper/quote",
        data: {
            text,
            referencedChirperId,
            mediaKeys
        }
    })
}
export const postReply = (text, inReplyToChirperId, mediaKeys) => {
    return JsonPost({
        url: sever + "/chirper/reply",
        data: {
            text,
            inReplyToChirperId,
            mediaKeys
        }
    })
}
export const getReply = (id, page) => {
    return Get({
        url: sever + "/chirper/child",
        params: {id, page}
    })
}
export const getByAuthor = (id, page) => {
    return Get({
        url: sever + "/chirper/author",
        params: {id, page}
    })
}
export const getTrend = (page, type) => {
    return Get({
        url: sever + "/chirper/trend",
        params: {page},
        data: {type}
    })
}
export const search = (keyword, page, isMedia) => {
    let data = new FormData();
    data.append("keyword", keyword);
    data.append("page", page);
    data.append("isMedia", isMedia);
    return FormPost({
        url: sever + "/chirper/search",
        data: data
    })
}
