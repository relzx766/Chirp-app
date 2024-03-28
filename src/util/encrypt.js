import bigInt from "big-integer";
import {getCharCode} from "@/util/tools";
import CryptoJs from "crypto-js";

export const generateKey = () => {
    const length = 12;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`·!@#$%^&*()-=_+[]{};:,<.>/?';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
export const generateIv = () => {
    let array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array));
}
export const mathPublicKey = (g, privateKey, p) => {
    g = bigInt(g);
    privateKey = getCharCode(privateKey);
    privateKey = bigInt(privateKey);
    p = bigInt(p);
    return g.modPow(privateKey, p);
}
export const getShareKey = (publicKey, privateKey, p) => {
    publicKey = bigInt(publicKey);
    privateKey = getCharCode(privateKey);
    privateKey = bigInt(privateKey);
    p = bigInt(p);
    return publicKey.modPow(privateKey, p);
}

export function cipherConvert(key, iv) {
    let keyBytes = CryptoJs.enc.Utf8.parse(CryptoJs.SHA256(key).toString().substring(0, 32));
    let ivBytes = CryptoJs.enc.Base64.parse(iv);
    return {key: keyBytes, iv: ivBytes};
}

export function doEncrypt(key, message, iv) {
    let {key: keyBytes, iv: ivBytes} = cipherConvert(key, iv);
    message = CryptoJs.enc.Utf8.parse(message);
    let encrypted = CryptoJs.AES.encrypt(message, keyBytes, {
        iv: ivBytes,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

export function doDecrypt(key, ciphertext, iv) {
    let {key: keyBytes, iv: ivBytes} = cipherConvert(key, iv);
    ciphertext = CryptoJs.enc.Hex.parse(ciphertext);
    ciphertext = CryptoJs.enc.Base64.stringify(ciphertext);
    let decrypted = CryptoJs.AES.decrypt(ciphertext, keyBytes, {
        iv: ivBytes,
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    });
    return decrypted.toString(CryptoJs.enc.Utf8).toString();
}

const PrivateKey = "private_key";

export function setPrivateKey(id, key) {
    localStorage.setItem(PrivateKey + ":" + id, key);
}

export function getPrivateKey(id) {
    return localStorage.getItem(PrivateKey + ":" + id);
}

export function removePrivateKey(id) {
    localStorage.removeItem(PrivateKey + ":" + id);
}

const PublicKey = "public_key";

export function setPublicKey(id, key) {
    localStorage.setItem(PublicKey + ":" + id, key);
}

export function getPublicKey(id) {
    return localStorage.getItem(PublicKey + ":" + id);
}

export function removePublicKey(id) {
    localStorage.removeItem(PublicKey + ":" + id);
}
