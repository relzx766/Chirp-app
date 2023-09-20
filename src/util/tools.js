import moment from "moment";

export const getCount = (num) => {
    if (num > 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
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
export const getMonthAndDay = (timestamp) => {
    let date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    return month + '/' + day;
}
export const descArray = (arr) => {
    return arr.sort((a, b) => {
        return b - a;
    })
}
export const ascArray = (arr) => {
    return arr.sort((a, b) => {
        return a - b;
    })
}
export const descDate = (dates) => {
    return dates.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    })
}
export const getDaysBetween = (dateString1, dateString2) => {
    let startDate = Date.parse(dateString1);
    let endDate = Date.parse(dateString2);
    let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days;
}
export const doPercent = (num1, num2) => {
    let percent = Math.ceil(num1 / num2 * 100);
    if (Number.isFinite(percent)) {
        return percent
    } else {
        return 0
    }
}
export const getToken = () => {
    return localStorage.getItem("token");
}
export const getFromStorage = (key) => {
    return localStorage.getItem(key);
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
    return text.replace(regex, "<a href='/profile?id=$1&type=username' @click.stop style='color:#409EFF;text-decoration: none;'>@$1</a>").replace("\u200B", "</br>");

}