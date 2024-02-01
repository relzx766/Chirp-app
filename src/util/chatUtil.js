import {doDecrypt, doEncrypt} from "@/util/encrypt";

export const  doChatDecrypt = async (chat, key) => {
    try {
         chat.content =await doDecrypt(key,chat.content,chat.iv);
        if (chat.reference&&chat.reference.content){
            chat.reference.content=await doDecrypt(key,chat.reference.content,chat.reference.iv);
        }
        return chat;//内容解密后的消息
    }catch (e){
        throw new Error(`解密消息失败==>${e}`);
    }

}
export const getOtherParticipantID=(topicID, knownParticipantID) =>{
    let ids = topicID.split('_');
    let otherParticipantID;

    if (ids[0] === knownParticipantID) {
        otherParticipantID = ids[1];
    } else {
        otherParticipantID = ids[0];
    }

    return otherParticipantID; // 另一位参与者的ID
}
