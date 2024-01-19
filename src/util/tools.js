import moment from "moment";
import {fileCategoryEnums} from "@/enums/enums";

export const getCount = (num) => {
    if (num > 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num ? num : 0;
}
export const getDate = (date) => {
    let before = new Date(date);
    let now = new Date();
    let time = (now - before) / 1000;
    let result;
    if (time < 120) {
        result = '刚刚'
    } else if (time < 3600) {
        result = Math.floor(time / 60) + "分钟前"
    } else if (time < 3600 * 24) {
        result = Math.floor(time / 3600) + "小时前"
    } else {
        result = before.toLocaleString()
    }
    return result;
}
export const getMessageDate = (date) => {
    date = new Date(date);
    let now = new Date();
    let formatDate = moment(date);
    //不在今年
    if (now.getFullYear() - date.getFullYear() > 0) {
        return formatDate.format("YYYY年MM月DD日");
    } else {
        //在今天
        if (date.getDay() === now.getDay()) {
            return formatDate.format("HH:mm");
            //在昨天
        } else if (now.getDay() - date.getDay() === 1) {
            return "昨天";
        } else {
            return formatDate.format("MM月DD日")
        }
    }
}

export const getNewMsgCount = (num) => {
    return num > 99 ? 99 : num;
}

export const bigNumberToString = (num) => {
    let str = "";
    num.c.forEach(n => {
        str = str + n;
    })
    return str;
}
export const formatText = (text) => {
// 查找@username
    const regex = /@(\w+)(?=\s|$)/g;
    return text.replace(regex,"<a href='/profile?id=$1&type=username' class='text-primary' @click.stop style='text-decoration: none;'>@$1</a>").replace("\u200B","</br>");

}
/**
 *
 * @param date1 时间戳
 * @param date2 时间戳
 * @returns {number} date1-date2
 */
export const subtractDates = (date1, date2) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return date1.getTime() - date2.getTime();
}
export const getCharCode=(str)=>{
    let code='';
    for (let i=0;i<str.length;i++){
        code+=str.charCodeAt(i);
    }
    return parseInt(code,10);
}
export const getCategory=(extension)=>{
        const imageSuffixes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoSuffixes = ['mp4', 'avi', 'flv', 'mov', 'wmv', 'rmvb', 'mkv'];
        if (imageSuffixes.includes(extension)) {
            return fileCategoryEnums.IMAGE;
        }else if (videoSuffixes.includes(extension)){
            return fileCategoryEnums.VIDEO;
        }else {
            return fileCategoryEnums.FILE;
        }
}