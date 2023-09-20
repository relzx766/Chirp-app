import {FormPost, Get, JsonPost} from "@/config/http";

const sever = "/chirp/user-service"
export const getShortProfile = (ids) => {
    let data = new FormData();
    data.append("ids", ids);
    return FormPost({
        url: sever + '/user/basic_info',
        data: data
    })
}
export const getDetailProfile = (id, type) => {
    return Get({
        url: sever + "/user/profile",
        params: {id},
        data: {type: type}
    })
}
export const putProfile = (user) => {
    return JsonPost({
        url: sever + "/user/profile/update",
        data: user
    })
}
export const follow = (id) => {
    let data = new FormData();
    return FormPost({
        url: sever + "/rela/follow",
        data: {
            toId: id
        }
    })
}
export const unFollow = (id) => {
    return FormPost({
        url: sever + "/rela/unfollow",
        data: {
            toId: id
        }
    })
}