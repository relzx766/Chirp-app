export const chatAllowEnum= {
    NOBODY: 0,
    ANYONE: 1
}
export const relationEnums = {
    FOLLOW:1,
    UNFOLLOW:2,
    BLOCK:3
}
export const messageStatusEnums={
    DELETE:"DELETE",
    READ:"READ",
    UNREAD:"UNREAD",
    SENDING:"SENDING",
    FAILED:"FAILED"
}
export const replyOrderEnums =  {
    HOT:"HOT",
    ASC:"ASC",
    DESC:"DESC"
}
export const commentRangeEnums={
    EVERYONE: {
        code:1,
        icon:'bi-globe-asia-australia'
    },
    FOLLOWING:{
        code:2,
        icon:'bi-person-check'
    },
    MENTION:{
        code:3,
        icon:'bi-at'
    }
}
export const chatTypeEnums={
    TEXT:"TEXT",
    IMAGE:"IMAGE",
    VOICE:"VOICE",
    VIDEO:"VIDEO",
    FILE:"FILE"
}
export const messageTypeEnums={
    CHAT:"CHAT",
    NOTICE:"NOTICE"
}
export const noticeTypeEnums={
    SYSTEM:"SYSTEM",
    USER:"USER"
}
export const noticeEventEnums={
    TWEETED:"TWEETED",
    LIKE:"LIKE",
    FORWARD:"FORWARD",
    QUOTE:"QUOTE",
    REPLY:"REPLY",
    FOLLOW:"FOLLOW",
    MENTIONED:"MENTIONED"
}
export const noticeStatusEnums={
    UNREAD:1,
    READ:2,
    DELETE:3
}
export const noticeEntityEnums={
    CHIRPER:"CHIRPER",
    USER:"USER"
}
export const chirperTypeEnums={
    ORIGIN:"ORIGIN",
    REPLY:"REPLY",
    FORWARD:"FORWARD",
    QUOTE:"QUOTE"
}
export const supportMediaTypeEnums={
    IMAGE:"IMAGE",
    VIDEO:"VIDEO"
}
export const fileCategoryEnums={
    IMAGE:"IMAGE",
    VIDEO:"VIDEO",
    FILE:"FILE"
}
export const chirperSearchEnums={
    REPLY:"reply",
    LIKE:"like",
    MEDIA:"media"
}
export const accountStatusEnums={
}
export const accountTypeEnums={
    USERNAME:"USERNAME",
    EMAIL:"EMAIL"
}
export const wsConnectionStatus={
    OPEN:1,
    CLOSE:2,
    ERROR:3,
    RETRY:4
}
