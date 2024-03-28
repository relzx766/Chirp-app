import {chunkMerge, chunkUpload, chunkUploadInit, fastUpload, upload,} from "@/api/media";
import SparkMD5 from "spark-md5";
import {uploadStatusEnums} from "@/enums/enums";
import {combineKey} from "./formatter";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_RETRY = 3;
/**
 * 当服务器返回409时，说明服务器已存在相同文件
 */
export const getFileMd5 = (file) => {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    let spark = new SparkMD5();
    return new Promise((resolve) => {
        fileReader.onload = (e) => {
            spark.appendBinary(e.target.result);
            resolve(spark.end());
        };
    });
};

class ChunkFile {
    constructor(file, options) {
        this.file = file;
        this.options = options;
        this.fileSize = file.size;
        this.chunkSize = options.chunkSize || CHUNK_SIZE;
        this.chunkTotal = Math.ceil(this.fileSize / this.chunkSize);
        this.chunkList = [];
        this.hashList = [];
        this.uploadId = "";
        this.extension = file.name.split(".").pop();
        this.type = file.type;
        this.objectName = "";
        this.sentSize = 0;
        this.complete = false;
        this.msg = options.msg;
    }

    async sliceFile() {
        for (let i = 0; i < this.chunkTotal; i++) {
            const start = this.chunkSize * i;
            const end = Math.min(start + this.chunkSize, this.fileSize);
            const chunk = this.file.slice(start, end);
            this.chunkList.push({
                file: chunk,
                index: i,
                status: uploadStatusEnums.PENDING,
                retry: 0,
            });
            const hash = await getFileMd5(chunk);
            this.hashList.push(hash);
        }
    }

    start() {
        return this.sliceFile()
            .then(() => {
                let hash = SparkMD5.hash(combineKey(...this.hashList));
                return fastUpload(hash);
            })
            .then((res) => {
                if (res.code === 200) {
                    this.complete = true;
                    this.options.onsuccess && this.options.onsuccess(res);
                } else {
                    if (this.fileSize > this.chunkSize) {
                        return chunkUploadInit(this.chunkTotal).then(async (r) => {
                            if (r.code === 200) {
                                this.uploadId = r.data.record.uploadId;
                                this.objectName = r.data.record.objectName;
                                for (let chunk of this.chunkList) {
                                    this.doUpload(chunk);
                                }
                            } else {
                                throw new Error(r.message);
                            }
                        });
                    } else {
                        return upload(this.file).then((res) => {
                            if (res.code === 200 || res.code === 409) {
                                this.complete = true;
                                this.options.onsuccess && this.options.onsuccess(res);
                            } else {
                                this.options.onerror && this.options.onerror(res.message);
                            }
                        });
                    }
                }
            });
    }

    break() {
        if (!this.complete) {
            this.complete = true;
            this.options.onerror && this.options.onerror("上传中断");
        }
    }

    async doUpload(chunk) {
        if (!this.complete) {
            chunk.status = uploadStatusEnums.UPLOADING;
            try {
                const res = await chunkUpload(chunk.file, this.uploadId, chunk.index);
                if (res.code === 200 || res.code === 409) {
                    chunk.status = uploadStatusEnums.SUCCESS;
                    this.sentSize++;
                    this.options.onprogress &&
                    this.options.onprogress({
                        total: this.chunkTotal,
                        finish: this.sentSize,
                    });
                } else {
                    throw new Error(res.message);
                }
                if (this.sentSize === this.chunkTotal) {
                    this.domerge();
                }
            } catch (e) {
                this.doRetry(chunk);
                this.options.onerror && this.options.onerror(e);
            }
        }
    }

    doRetry(chunk) {
        if (chunk.retry > MAX_RETRY) {
            chunk.status = uploadStatusEnums.ERROR;
            this.options.onerror &&
            this.options.onerror(
                `文件${this.file.name}的第${chunk.index}块切片已达最大重试次数`
            );
        } else {
            chunk.status = uploadStatusEnums.PENDING;
            this.options.onretry &&
            this.options.onretry(
                `文件${this.file.name}的第${chunk.index}块切片上传重试`
            );
            this.doUpload(chunk);
        }
    }

    domerge() {
        chunkMerge(
            this.uploadId,
            this.objectName,
            this.chunkTotal,
            this.type,
            this.extension
        )
            .then((res) => {
                if (res.code === 200 || res.code === 409) {
                    this.complete = true;
                    this.options.onsuccess && this.options.onsuccess(res);
                } else {
                    throw new Error(res.message);
                }
            })
            .catch((e) => {
                this.options.onerror && this.options.onerror(e);
            });
    }
}

export default ChunkFile;
