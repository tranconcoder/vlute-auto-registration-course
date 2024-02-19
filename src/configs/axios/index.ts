import type { AxiosError } from "axios";

import axios from "axios";
import dotenv from "dotenv";
import { BASE_URL } from "../base";
import { wrapper } from "axios-cookiejar-support";
import tough from "tough-cookie";

dotenv.config();

const jar = new tough.CookieJar();
const vluteInstance = wrapper(
    axios.create({
        jar,
        baseURL: BASE_URL,
        withCredentials: true,
    })
);

vluteInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        console.log(1111111111)
        // Remake the request
        const method = error.response?.config.method || "get";
        const url = error.request.responseURL;
        const option = error.response?.config;

        return Promise.resolve((vluteInstance as any)[method](url, option));
    }
);

export { vluteInstance };
