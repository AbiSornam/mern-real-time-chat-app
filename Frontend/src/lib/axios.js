import axios from "axios";
const BASE_URL=import.meta.env.MODE==="production"? "http://localhost:5001/api" : "/api";
export const axiosInstance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true,   //sends cookies for user authentication
});