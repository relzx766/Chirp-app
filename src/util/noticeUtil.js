import {noticeEventEnums} from "@/enums/enums";

export const isOnlineNotice = (notice) => {
    let onlineEvent=[
        noticeEventEnums.TWEETED
    ]
  return onlineEvent.includes(notice.event);
}
export const isPersistNotice = (notice) => {
  let persistEvent=[
      noticeEventEnums.LIKE,
      noticeEventEnums.FORWARD,
      noticeEventEnums.QUOTE,
      noticeEventEnums.REPLY,
      noticeEventEnums.FOLLOW,
      noticeEventEnums.MENTIONED
  ];
  return persistEvent.includes(notice.event);
}
export const entityParse = (notice) => {
    if (notice.entity!==null&&notice.entity!=='null'){
        notice.entity=JSON.parse(notice.entity);
    }
    if (notice.sonEntity!==null&&notice.sonEntity!=='null'){
        notice.sonEntity=JSON.parse(notice.sonEntity);
    }
    return notice;
}
export const isChirpInteraction=(event)=>{
    let chirpInteraction=[
        noticeEventEnums.LIKE,
        noticeEventEnums.FORWARD,
        noticeEventEnums.QUOTE,
        noticeEventEnums.REPLY,
        noticeEventEnums.FOLLOW,
        noticeEventEnums.MENTIONED
    ];
    return chirpInteraction.includes(event);
}
export const generateUniqueKey = (notice) => {
    let key=notice.id;
    if (notice.event===noticeEventEnums.LIKE||noticeEventEnums.FORWARD){
        key=`${notice.event}:${notice.senderId}:${notice.sonEntity.id}`;
    }else if (notice.event===noticeEventEnums.FOLLOW){
        key=`${notice.event}:${notice.senderId}`;
    }
    return key;
}