import {FormPost, Get, JsonPost} from "@/config/http";

export const signIn = (account, password) => {
    return FormPost({
        url: '/chirp/auth-service/auth/signIn',
        data: {
            account,
            password
        }
    })
}
export const signUp = (username, password, email, birthday) => {
    return JsonPost({
        url: '/chirp/auth-service/auth/signUp',
        data: {
            username,
            password,
            email,
            birthday
        }
    })
}
export function signOut() {
    return Get({
        url: '/chirp/auth-service/auth/signOut'
    })
}
