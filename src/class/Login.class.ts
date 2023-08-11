import axios from "axios";
import clc from "cli-color";
import { courseRegistrationInstance } from "../configs/axios/index";
import readline from "./Readline.class";

export default class Login {
    public result = false;
    private username?: string;
    private password?: string;
    private sessionId?: string = undefined;

    public constructor() {
        console.log(clc.cyan("Vui lòng đăng nhập trước khi đăng ký học phần"));
    }

    public async handleLogin(): Promise<void> {
        const loginForm = new FormData();

        loginForm.append("username", this.username || "");
        loginForm.append("password", this.password || "");

        return axios
            .post("https://qldt.vlute.edu.vn/VLUTE-Web/login.action", loginForm)
            .then((data) => {
                const responseUrl = data.request?.res?.responseUrl as
                    | string
                    | undefined;

                if (responseUrl?.includes("jsessionid=")) {
                    this.result = true;
                    this.sessionId = responseUrl.split("jsessionid=").at(-1);
                }
            });
    }

    public updateAxiosInstanceCookie() {
        courseRegistrationInstance.defaults.headers.common.Cookie = `JSESSIONID=${this.sessionId}`;
    }

    public async inputUsernameAndPassword() {
        this.username = await readline.input("Tên đăng nhập: ");
        this.password = await readline.input("Mật khẩu: ");
    }

    public getLoginResult() {
        return this.result;
    }
}
