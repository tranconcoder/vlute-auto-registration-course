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

export { vluteInstance };
