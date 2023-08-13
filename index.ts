import dotenv from "dotenv";
import cliColor from "cli-color";
import login from "./src/class/Login.class";
import {
    success,
    error,
} from "./src/utils/courseRegistration/cliColor/cliColor.util";
import Course from "./src/class/Course.class";

dotenv.config();

console.clear();
console.log(
    cliColor.blue("Chào mừng đến với ứng dụng tự động đăng ký học phần!")
);

(async () => {
    do {
        // Handle login
        login.showTitle();
        await login.inputUsernameAndPassword();
        await login.handleLogin();

        if (login.getLoginResult()) {
            console.log(success("Đăng nhập thành công!"));
        } else {
            console.log(error("Đăng nhập thất bại!"));
        }
    } while (!login.getLoginResult());

    const course = new Course();
    course.loadCourseListFromExcel();
    await course.loadCourseDetailInfo();
    await course.regisCourse();
})();
