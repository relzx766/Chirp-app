import {FormPost, Get, JsonPost} from "@/config/http";

const sever = "/chirp/user-service"
export const load = () => {
    return Get({
        url: sever + '/user/load'
    })
}

export const getDetailProfile = (username) => {
    return Get({
        url: `${sever}/user/profile/${username}`
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
export const block = (id) => {
    return FormPost({
        url: sever + "/rela/block",
        data: {
            toId: id
        }
    })
}
export const unBlock = (id) => {
    return FormPost({
        url: sever + "/rela/unblock",
        data: {
            toId: id
        }
    })
}
/**
 * 获取我与用户名的关系，以用户们为起点，即用户们=fromId，我=toId
 * @param ids
 * @returns {Promise | Promise<unknown>}
 */
export const getRelations = (ids) => {
    return JsonPost({
        url: `${sever}/rela/people/me`,
        data: ids
    })
}
export const search = (keyword, page) => {
    return Get({
        url: `${sever}/user/search/${page}`,
        data: {keyword}
    })
}
export const getFollower = (id, page) => {
    return Get({
        url: `${sever}/user/follower/${id}/${page}`
    })
}
export const getFollowing = (id, page) => {
    return Get({
        url: `${sever}/user/following/${id}/${page}`
    })

}

export const checkUsername = (username) => {
    return Get({
        url: `${sever}/user/username/check/${username}`
    })
}
export const checkEmail = (email) => {
    return Get({
        url: `${sever}/user/email/check/${email}`
    })
}
export const getProfile = (userIds) => {
    return JsonPost({
        url: `${sever}/user/profile`,
        data: userIds
    })
}
export const getFollowCount = (id) => {
    return Get({
        url: `${sever}/rela/count/${id}`
    })
}