export const chatAllowEnum = {
    NOBODY: 0,
    ANYONE: 1,
};
export const relationEnums = {
    FOLLOW: 1,
    UNFOLLOW: 2,
    BLOCK: 3,
};
export const messageStatusEnums = {
    DELETE: "DELETE",
    READ: "READ",
    UNREAD: "UNREAD",
    SENDING: "SENDING",
    FAILED: "FAILED",
};
export const orderEnums = {
    HOT: "HOT",
    ASC: "ASC",
    DESC: "DESC",
};
export const commentRangeEnums = {
    EVERYONE: {
        code: 1,
        icon: "bi-globe-asia-australia",
    },
    FOLLOWING: {
        code: 2,
        icon: "bi-person-check",
    },
    MENTION: {
        code: 3,
        icon: "bi-at",
    },
};
export const chatTypeEnums = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    VOICE: "VOICE",
    VIDEO: "VIDEO",
    FILE: "FILE",
};
export const messageTypeEnums = {
    CHAT: "CHAT",
    NOTICE: "NOTICE",
};
export const noticeTypeEnums = {
    SYSTEM: "SYSTEM",
    USER: "USER",
};
export const noticeEventEnums = {
    TWEETED: "TWEETED",
    LIKE: "LIKE",
    FORWARD: "FORWARD",
    QUOTE: "QUOTE",
    REPLY: "REPLY",
    FOLLOW: "FOLLOW",
    MENTIONED: "MENTIONED",
};
export const noticeStatusEnums = {
    UNREAD: 1,
    READ: 2,
    DELETE: 3,
};
export const noticeEntityEnums = {
    CHIRPER: "CHIRPER",
    USER: "USER",
};
export const chirperTypeEnums = {
    ORIGIN: "ORIGIN",
    REPLY: "REPLY",
    FORWARD: "FORWARD",
    QUOTE: "QUOTE",
};
export const supportMediaTypeEnums = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
};
export const fileCategoryEnums = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    FILE: "FILE",
};
export const chirperSearchEnums = {
    REPLY: "reply",
    LIKE: "like",
    MEDIA: "media",
};
export const accountStatusEnums = {};
export const accountTypeEnums = {
    USERNAME: "USERNAME",
    EMAIL: "EMAIL",
};
export const wsConnectionStatus = {
    OPEN: 1,
    CLOSE: 2,
    ERROR: 3,
    RETRY: 4,
};
export const uploadStatusEnums = {
    PENDING: 1,
    UPLOADING: 2,
    SUCCESS: 3,
    ERROR: 4,
};
export const communityJoinRangeEnums = {
    ANYONE: {value: 1, alias: '任何人都可以加入'},
    MEMBER: {value: 2, alias: '成员邀请的人可以加入'},
    MODERATOR: {value: 3, alias: '版主邀请的人可以加入'},
    ADMIN: {value: 4, alias: '管理员邀请的人可以加入'},
    find: (value) => {
        switch (value) {
            case communityJoinRangeEnums.ANYONE.value:
                return communityJoinRangeEnums.ANYONE;
            case communityJoinRangeEnums.MEMBER.value:
                return communityJoinRangeEnums.MEMBER;
            case communityJoinRangeEnums.MODERATOR.value:
                return communityJoinRangeEnums.MODERATOR;
            case communityJoinRangeEnums.ADMIN.value:
                return communityJoinRangeEnums.ADMIN;
            default:
                return null;
        }
    }
}
export const communityPostRangeEnums = {
    MEMBER: {value: 2, alias: '只有成员可以发布、评论'},
    MODERATOR: {value: 3, alias: '只有版主和管理员可以发布、评论和点赞'},
    ADMIN: {value: 4, alias: '只有管理员可以发布、评论和点赞'},
    find: (value) => {
        switch (value) {
            case communityPostRangeEnums.MEMBER.value:
                return communityPostRangeEnums.MEMBER;
            case communityPostRangeEnums.MODERATOR.value:
                return communityPostRangeEnums.MODERATOR;
            case communityPostRangeEnums.ADMIN.value:
                return communityPostRangeEnums.ADMIN;
            default:
                return null;
        }
    }
}
export const communityMemberEnums = {
    MEMBER: {value: 2, alias: '成员'},
    MODERATOR: {value: 3, alias: '版主'},
    ADMIN: {value: 4, alias: '管理员'},
    find: (value) => {
        switch (value) {
            case communityMemberEnums.MEMBER.value:
                return communityMemberEnums.MEMBER;
            case communityMemberEnums.MODERATOR.value:
                return communityMemberEnums.MODERATOR;
            case communityMemberEnums.ADMIN.value:
                return communityMemberEnums.ADMIN;
            default:
                return null;
        }
    }
}
export const approveStatusEnums = {
    PENDING: {value: 1, alias: '已申请'},
    ACCEPT: {value: 2, alias: '通过'},
    REJECT: {value: 3, alias: '拒绝'},
    INVALID: {value: 4, alias: '未申请'},
    find: (value) => {
        switch (value) {
            case approveStatusEnums.PENDING.value:
                return approveStatusEnums.PENDING;
            case approveStatusEnums.REJECT.value:
                return approveStatusEnums.REJECT;
            case approveStatusEnums.ACCEPT.value:
                return approveStatusEnums.ACCEPT;
            default:
                return null;
        }
    }
}
export const initStatusEnums = {
    WAITING: 1,
    SUCCESS: 2,
    FAILED: 3
}