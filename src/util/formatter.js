import moment from "moment";
import 'moment/locale/zh-cn';

export const yearMonthDay = (timestamp) => {
    return moment(new Date(timestamp)).format("YYYY年M日DD日")
}
export const yMdHm = (timestamp) => {
    return moment(new Date(timestamp)).format("YYYY/M/DD HH:mm")
}

export const msgDate = (date) => {
    let m = moment(new Date(date));
    m.locale('zh-cn');
    if (m.isSame(moment(), 'day')) {
        return m.format('HH:mm');
    }
    if (m.isSame(moment(), 'week')) {
        return m.format('dddd');
    }
    if (m.isSame(moment(), 'year')) {
        return m.format('MM月DD日');
    }
    return m.format('YYYY年MM月DD日');
}
export const chatDate = (date) => {
    let m = moment(new Date(date));
    m.locale('zh-cn');
    if (m.isSame(moment(), 'day')) {
        return m.format('HH:mm');
    }
    if (m.isSame(moment(), 'week')) {
        return m.format('dddd HH:mm');
    }
    if (m.isSame(moment(), 'year')) {
        return m.format('MM月DD日 HH:mm');
    }
    return m.format('YYYY年MM月DD日 HH:mm');
}
