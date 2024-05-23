import axios from "axios"

const API = axios.create({
    baseURL :  "https://localhost:5000"
})

export const RegisterUser = (data) => API.post("/api/users", data)
export const LoginUser = (data) => API.post("/api/auth", data)

