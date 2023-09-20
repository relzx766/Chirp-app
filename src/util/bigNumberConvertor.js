var data = {};
const doConvert = (JsonFd) => {
    switch (typeof JsonFd) {
        case 'object':
            IntroductionTypeProcessing(JsonFd);
            break;
        default:
            return;
    }
}

function isNumber(value) {
    return typeof value === 'number';
}

const IntroductionTypeProcessing = (JsonFd) => {
    for (let key in JsonFd) {
        const proxy = JsonFd[key];
        if (proxy.c && proxy.e && proxy.s
            && Number(proxy.e) && Number(proxy.s) && proxy.c.every(isNumber)) {
            JsonFd[key] = proxy.c.join('');
        } else {
            doConvert(JsonFd[key]);
        }
    }
}

export default (JsonFd) => {
    data = JsonFd;
    doConvert(data);
    return data;
}
