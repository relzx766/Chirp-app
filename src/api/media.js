import {FormPost, JsonPost} from "@/config/http";

const server = "/chirp/media-service";
export const upload = (data) => {
    return FormPost({
        url: server + "/media/upload",
        data: data
    })
}
export const uploadSlice = (data) => {
    return FormPost({
        url: server + "/media/upload/slice",
        data: data
    })
}
export const merge = (extension, md5) => {
    return JsonPost({
        url: server + "/media/merge",
        data: {
            extension, md5
        }
    })
}
export const fastUpload=(hash)=>{
    let data=new FormData();
    data.append("hash",hash);
    return FormPost({
        url:`${server}/media/fast`,
        data:data
    })
}
