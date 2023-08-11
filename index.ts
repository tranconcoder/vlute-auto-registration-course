import dotenv from "dotenv";
import { courseRegistration } from "./src/utils/courseRegistration";
import cliColor from "cli-color";
import Login from "./src/class/Login.class";
import {
    success,
    error,
} from "./src/utils/courseRegistration/cliColor/cliColor.util";

dotenv.config();

console.clear();
console.log(
    cliColor.blue("Chào mừng đến với ứng dụng tự động đăng ký học phần!")
);

(async () => {
    // Handle login
    const login = new Login();

    do {
        await login.inputUsernameAndPassword();
        await login.handleLogin();
        login.updateAxiosInstanceCookie();

        if (login.getLoginResult()) {
            console.log(success("Đăng nhập thành công!"));
        } else {
            console.log(error("Đăng nhập thất bại!"));
        }
    } while (!login.getLoginResult());

    const result = await courseRegistration({
        lopMonHocId: 65241,
    });
})();
