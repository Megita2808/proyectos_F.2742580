import { jwtDecode } from "jwt-decode";

export default function useDecodedJwt(token) {
    if(!token)return
    const { payload } = jwtDecode(token)
    return payload
}