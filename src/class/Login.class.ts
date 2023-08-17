import clc from "cli-color";
import { vluteInstance } from "../configs/axios";
import { getDotDangKyId } from "../utils/courseRegistration";
import { promptSync } from "../configs/prompt";

class Login {
    public result = false;
    private username?: string;
    private password?: string;

    public constructor() {}

    public showTitle() {
        console.log(clc.cyan("Vui lòng đăng nhập trước khi đăng ký học phần"));
    }

    public async handleLogin(): Promise<boolean> {
        const loginForm = new FormData();

        loginForm.append("username", this.username || "");
        loginForm.append("password", this.password || "");

        await vluteInstance.post("login.action", loginForm);

        const checkPermissionForm = new FormData();
        const dotDangKyId = await getDotDangKyId();
        checkPermissionForm.append("dotDKId", dotDangKyId.toString());

        return vluteInstance
            .post("/hocvien/kiemTraQuyenDangKy.action", checkPermissionForm)
            .then(({ data }) => (this.result = data.code === "SUCCESS"));
    }

    public async inputUsernameAndPassword() {
        this.username = process.env.VLUTE_USERNAME || promptSync("Tên đăng nhập: ");
        this.password =
            process.env.VLUTE_PASSWORD ||
            promptSync("Mật khẩu: ", {
                echo: "*",
            });
    }

    public getLoginResult() {
        return this.result;
    }
}

const login = new Login();
export default login;
