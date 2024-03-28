import {doDecrypt} from "@/util/encrypt";
import {chatAllowEnum, chatTypeEnums, relationEnums} from "@/enums/enums";

export const doChatDecrypt = (chat, key) => {
    try {
        chat.content = doDecrypt(key, chat.content, chat.iv);
        if (
            chat.type === chatTypeEnums.VIDEO ||
            chat.type === chatTypeEnums.IMAGE ||
            chat.type === chatTypeEnums.FILE
        ) {
            chat.content = JSON.parse(chat.content);
        }
        if (chat.reference && chat.reference.content) {
            chat.reference.content = doDecrypt(
                key,
                chat.reference.content,
                chat.reference.iv
            );
            if (
                chat.reference.type === chatTypeEnums.VIDEO ||
                chat.reference.type === chatTypeEnums.IMAGE ||
                chat.reference.type === chatTypeEnums.FILE
            ) {
                chat.reference.content = JSON.parse(chat.reference.content);
            }
        }
        return chat; //内容解密后的消息
    } catch (e) {
        throw new Error(`解密消息失败==>${e}`);
    }
};
export const getOtherParticipantID = (topicID, knownParticipantID) => {
    let ids = topicID.split("_");
    let otherParticipantID;

    if (ids[0] === knownParticipantID) {
        otherParticipantID = ids[1];
    } else {
        otherParticipantID = ids[0];
    }

    return otherParticipantID; // 另一位参与者的ID
};

export function getChatable(user) {
    return (
        ((user.chatSetting.allow === chatAllowEnum.ANYONE &&
                relationEnums.BLOCK !== user.relationReverse) ||
            user.id === this.user.id ||
            user.relationReverse === relationEnums.FOLLOW) &&
        user.chatSetting.chatReady
    );
}

export function getMsgHit(message) {
    let placeholder = "";
    switch (message.type) {
        case chatTypeEnums.IMAGE:
            placeholder = "[图片]";
            break;
        case chatTypeEnums.VIDEO:
            placeholder = "[视频]";
            break;
        case chatTypeEnums.VOICE:
            placeholder = "[语音]";
            break;

        case chatTypeEnums.FILE:
            placeholder = message.content.url;
            break;

        default:
            placeholder = message.content;
    }
    return placeholder;
}