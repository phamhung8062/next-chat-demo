import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_HOST + '/api/';

export const axiosInstance  = axios.create({
    baseURL: URL,
    timeout: 15000
});
