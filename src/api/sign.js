import {Get, JsonPost} from "@/config/http";

const base = '/chirp/auth-service'
export const signIn = (account, password, accountType) => {
    return JsonPost({
        url: '/chirp/auth-service/auth/signIn',
        data: {
            account,
            password,
            accountType
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

export function resetPwd(currentOne, newOne) {
    return JsonPost({
        url: `${base}/auth/pwd/reset`,
        data: {currentOne, newOne}
    })
}