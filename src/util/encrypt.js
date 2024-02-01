import bigInt from "big-integer";
import {getCharCode} from "@/util/tools";

const CryptoJs=require("crypto-js");
export const generateKey=()=>{
    const length=12;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`·!@#$%^&*()-=_+[]{};:,<.>/?';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
export const generateIv=()=>{
    let array = new Uint8Array(12);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
}
export const mathPublicKey = (g, privateKey, p) => {
   g = bigInt(g);
    privateKey=getCharCode(privateKey);
    privateKey = bigInt(privateKey);
   p=bigInt(p);
   return g.modPow(privateKey,p);
}
export const getShareKey=(publicKey,privateKey,p)=>{
    publicKey=bigInt(publicKey);
    privateKey=getCharCode(privateKey);
    privateKey=bigInt(privateKey);
    p=bigInt(p);
    return publicKey.modPow(privateKey,p);
}
export async function cipherConvert(key, iv) {
    //这句绝对不可删 --
    await Promise.resolve();
    //--
    let encoder = new TextEncoder();

    // 将字符串密钥转换为字节数组
    let keyBytes = encoder.encode(key);

    // 使用PBKDF2派生一个密钥
    let cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        {name: "PBKDF2"},
        false,
        ["deriveKey"]
    );

    // 创建AES-GCM密钥
    let aesKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: keyBytes,
            iterations: 100000,
            hash: "SHA-256"
        },
        cryptoKey,
        {name: "AES-GCM", length: 256},
        false,
        ["encrypt", "decrypt"]
    );

    // 将IV转换为字节数组
    let ivBytes = new Uint8Array(atob(iv).split("").map(function(c) {
        return c.charCodeAt(0);
    }));

    return {key: aesKey, iv: ivBytes};
}

export const doEncrypt = async (key, message, iv) => {
    try {
        let encoder = new TextEncoder();
        // 调用cipherConvert函数获取密钥和IV
        let {key: aesKey, iv: ivBytes} = await cipherConvert(key, iv);

        // 将消息转换为字节数组
        let messageBytes = encoder.encode(message);

        // 加密消息
        let ciphertext = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: ivBytes
            },
            aesKey,
            messageBytes
        );

        // 返回加密后的数据
        return  btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));
    }catch (e){
        throw new Error(`无法加密数据==>${e}`);
    }

}

export const doDecrypt = async (key, ciphertext, iv) => {
    try {
        // 调用cipherConvert函数获取密钥和IV
        let {key: aesKey, iv: ivBytes} = await cipherConvert(key, iv);
        // 将密文转换为字节数组
        let ciphertextBytes =new Uint8Array(atob(ciphertext).split("").map(function(c) {
            return c.charCodeAt(0);
        }));
        // 解密密文
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: ivBytes
            },
            aesKey,
            ciphertextBytes
        );
        // 返回解密后的数据
        return new TextDecoder().decode(new Uint8Array(decrypted));
    }catch (e){
        throw new Error(`无法解密数据==>${e}`);
    }

}

const PrivateKey="private_key";
export function setPrivateKey(id,key) {
    localStorage.setItem(PrivateKey+":"+id, key);
}
export function getPrivateKey(id) {
    return localStorage.getItem(PrivateKey+":"+id);
}
export function removePrivateKey(id) {
    localStorage.removeItem(PrivateKey+":"+id);
}
const PublicKey="public_key";
export function setPublicKey(id,key) {
    localStorage.setItem(PublicKey+":"+id, key);
}
export function getPublicKey(id){
    return localStorage.getItem(PublicKey+":"+id);
}
export function removePublicKey(id) {
    localStorage.removeItem(PublicKey+":"+id);
}
