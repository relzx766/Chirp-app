import {FormPost, Get, JsonPost} from "@/config/http";

const server = "/chirp/community-service";

export function addCommunity(community) {
    return JsonPost({
        url: `${server}/community/save`,
        data: community
    })
}

export function updateCommunity(community) {
    return JsonPost({
        url: `${server}/community/update`,
        data: community
    })
}

export function getCommunityDetail(id) {
    return Get({
        url: `${server}/community/detail/${id}`
    })
}

export function getCommunityPage({keyword, page, pageSize = 100}) {
    return JsonPost({
        url: `${server}/community/page`,
        data: {keyword, page, pageSize}
    })
}

export function joinCommunity({id}) {
    return JsonPost({
        url: `${server}/community/join`,
        data: {id}
    })
}

export function leaveCommunity({communityId, userId}) {
    return FormPost({
        url: `${server}/community/leave`,
        data: {communityId, userId}
    })
}

export function updateRole({communityId, userId, role}) {
    return FormPost({
        url: `${server}/community/role/update`,
        data: {communityId, userId, role}
    })
}

export function getMember({role, communityId, page = 1, pageSize = 50}) {
    return JsonPost({
        url: `${server}/member/query`,
        data: {role, communityId, page, pageSize}
    })
}

export function getMemberOfCommunity(id) {
    return Get({
        url: `${server}/member/${id}`
    })
}

export function approve({id, status}) {
    return JsonPost({
        url: `${server}/apply/approve`,
        data: {id, status}
    })
}

export function getApply({communityId, page = 1, pageSize = 50, status = [], order}) {
    return JsonPost({
            url: `${server}/apply/page`,
            data: {communityId, page, pageSize, status}
        }
    )
}