import {FormPost, JsonPost} from "@/config/http";

const server = "/chirp/media-service";
export const upload = (file) => {
    return FormPost({
        url: server + "/media/upload",
        data: {file},
    });
};

export const fastUpload = (hash) => {
    let data = new FormData();
    data.append("hash", hash);
    return FormPost({
        url: `${server}/media/fast`,
        data: data,
    });
};
export const chunkUploadInit = (size) => {
    return FormPost({
        url: `${server}/media/upload/chunk/init`,
        data: {size},
    });
};
export const chunkUpload = (file, uploadId, index) => {
    return FormPost({
        url: `${server}/media/upload/chunk`,
        data: {file, uploadId, index},
    });
};
export const chunkMerge = (
    uploadId,
    objectName,
    chunkSize,
    type,
    extension
) => {
    return JsonPost({
        url: `${server}/media/upload/chunk/merge`,
        data: {uploadId, objectName, chunkSize, type, extension},
    });
};
export const getByIds = (id) => {
    return FormPost({
        url: `${server}/media/url/get`,
        data: {id},
    });
};
