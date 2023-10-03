import moment from "moment";

export const yearMonthDay = (timestamp) => {
    return moment(new Date(timestamp)).format("YYYY年M日DD日")
}
export const yMdHm = (timestamp) => {
    return moment(new Date(timestamp)).format("YYYY/M/DD hh:mm")
}
