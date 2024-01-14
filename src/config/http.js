import axios from "axios";
import {Message} from "element-ui";
import {getToken} from "@/util/auth";

const service = axios.create({
    timeout: 30000,  // 请求 30s 超时
    baseURL: "http://192.168.169.129:443",
    headers: {
        get: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        post: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    },
})

// get 请求
export function Get({url, params = {}, data = {}}) {
    for (const key in params) {
        url = url + "/" + params[key]
    }
    return new Promise((resolve, reject) => {
        service
            .get(url, {
                params: data
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

// post
// post请求
export function JsonPost({url, data = {}, params = {}}) {
    return new Promise((resolve, reject) => {
        service({
            url,
            method: 'post',
            // 发送的数据
            data,
            //url参数
            params,
        }).then((res) => {
            resolve(res.data)
        })
    })
}

export function FormPost({url, data = {}, params = {}}) {
    return new Promise((resolve, reject) => {
        service({
            url,
            method: 'post',
            headers: 'Content-Type:multipart/form-data;charset=utf-8',
            // 发送的数据
            data,
            //url参数
            params,
        }).then((res) => {
            resolve(res.data)
        })
    })
}

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 每次发送请求之前判断是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况，此处token一般是用户完成登录后储存到localstorage里的
        let token = getToken()
        if (token) {
            config.headers.setAuthorization(token)
        }
        return config
    },
    (error) => {
        return Promise.error(error)
    }
)
// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);

        } else if (response.status === 401 || response.data.code === 401) {
            window.location.href = "/home"
        } else {
            return Promise.reject(response)
        }
    },
    (error) => {
        // 我们可以在这里对异常状态作统一处理
        if (error.response.status) {
            // 处理请求失败的情况
            // 对不同返回码对相应处理
            Message.error(error.response.data.message)
            return Promise.reject(error.response)
        }
    }
)
