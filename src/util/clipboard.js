import {Message} from "element-ui";

export function copy(text) {
    return navigator.clipboard.writeText(text).then(() => {
        Message({
            message: '已复制到剪切板',
            iconClass: "el-icon-document-copy",
            customClass: "bottom-msg",
            offset: 630,
            duration: 1000
        })

    });
}
