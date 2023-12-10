import bigInt from "big-integer";
import cryptoJs from "crypto-js";
import {getCharCode} from "@/util/tools";
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
export const doEncrypt=(key,message)=>{
    message=cryptoJs.enc.Utf8.parse(message);
    message=cryptoJs.enc.Base64.stringify(message);
     return  cryptoJs.AES.encrypt(message,key).toString();
}
export const doDecrypt=(key,message)=>{
  message= cryptoJs.AES.decrypt(message,key).toString(cryptoJs.enc.Utf8);
   return  cryptoJs.enc.Base64.parse(message).toString(cryptoJs.enc.Utf8)
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
