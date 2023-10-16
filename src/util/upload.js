import SparkMD5 from 'spark-md5'
import {merge, uploadSlice} from "@/api/media";

const CHUNK_SIZE = 3 * 1024 * 1024;
const MAX_RETRY = 3;
export const getMd5 = (file) => {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file.slice(0, file.size));
        fileReader.onload = e => {
            spark.append(e.target.result);
            resolve(spark.end());
        }
        fileReader.onerror = e => {
            reject(e);
        }
    })
}


class ChunkUpload {
    constructor(file, options) {
        this.file = file;
        this.options = options;
        this.fileSize = file.size;
        this.chunkSize = options.chunkSize || CHUNK_SIZE;
        this.chunkTotal = Math.ceil(this.fileSize / this.chunkSize);
        this.chunkList = [];
        this.md5 = "";
        this.sentSize = 0;
        this.status = false;
        this.msg = options.msg;
        //每次仅允许一个切片上传
        this.uploadLock = false;
    }

    start() {
        this.getFileMd5().then(md5 => {
            this.md5 = md5;
            for (let i = 0; i < this.chunkTotal; i++) {
                if (this.status) {
                    break;
                }
                this.uploadChunk(this.chunkList[i]);
            }
        });
    }

    stop() {
        if (!this.status) {
            this.status = true;
            this.options.onError && this.options.onError({message: "上传中断"});
        }
    }

    getFileMd5() {
        return new Promise((resolve, reject) => {
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();
            let curChunk = 0;

            const loadNextChunk = () => {
                const start = curChunk * this.chunkSize;
                const end = Math.min(start + this.chunkSize, this.fileSize);
                const chunk = this.file.slice(start, end);
                fileReader.readAsArrayBuffer(chunk);
                this.chunkList.push({
                    file: chunk,
                    seq: curChunk,
                    //pending uploading success error
                    status: 'pending',
                    retry: 0
                });
            };

            fileReader.onload = e => {
                spark.append(e.target.result);
                curChunk++;
                if (curChunk < this.chunkTotal) {
                    loadNextChunk();
                } else {
                    resolve(spark.end());
                }
            };

            fileReader.onerror = e => {
                reject(e);
            };

            loadNextChunk();
        });
    }

    uploadChunk(chunk) {
        if (!this.status) {
            if (chunk.status !== 'uploading' || chunk.status !== 'success') {
                if (chunk.status === 'error') {
                    chunk.retry++;
                }
                chunk.status = 'uploading';
                let data = new FormData();
                data.append("file", chunk.file);
                data.append("hash", this.md5);
                data.append("seq", chunk.seq);
                uploadSlice(data).then(res => {
                    if (res.code !== 409) {
                        if (res.code === 200) {
                            chunk.status = 'success';
                            this.sentSize++;
                            this.options.onProgress &&
                            this.options.onProgress({
                                total: this.chunkTotal,
                                finish: this.sentSize,
                                remaining: this.chunkTotal - this.sentSize
                            });
                            if (this.sentSize >= this.chunkTotal) {
                                this.merge();
                            }
                        } else {
                            this.retry(chunk);
                        }
                    } else {
                        this.status = true;
                        this.options.onSuccess && this.options.onSuccess(res);
                    }
                }).catch(err => {
                    this.retry(chunk);
                })
            }
        }

    }

    retry(chunk) {
        chunk.status = "error";
        if (chunk.retry < MAX_RETRY) {
            this.uploadChunk(chunk);
        }
    }

    merge() {
        const type = this.file.name.split(".").pop();
        merge(type, this.md5).then(r => {
            if (r.code === 200) {
                this.status = true;
                this.msg = "上传成功";
                this.options.onSuccess && this.options.onSuccess(r);

            } else {
                this.options.onError && this.options.onError(r.message);
            }
        }).catch(err => {
            this.options.onError && this.options.onError(err);
        });
    }
}


export default ChunkUpload;
