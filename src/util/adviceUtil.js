const chatAudio = new Audio(require('../assets/chat_advice.mp3'))
export const getAdviceAudio = () => {
    return chatAudio;
}
export const adviceStrategyEnums = {
    AUDIO: 1,
}

export function adviceStrategy(em) {
    switch (em) {
        case adviceStrategyEnums.AUDIO:
            // 播放音频
            return getAdviceAudio().play();
        default:
            break;
    }
}
