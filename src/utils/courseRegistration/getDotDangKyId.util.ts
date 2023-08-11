import { courseRegistrationInstance } from "../../configs/axios/index";
import dotenv from "dotenv";
import { success } from "./cliColor/cliColor.util";
import readline from "../../class/Readline.class";
import {
    dotDangKyId,
    setDotDangKyId,
} from "../../configs/course/coursesRegistrationInfo.config";

dotenv.config();

export default async function getDotDangKyId() {
    if (dotDangKyId) return dotDangKyId;

    const formData = new FormData();

    formData.append("hocKyId", process.env.HOC_KY_ID as string);

    return courseRegistrationInstance
        .post("dkmhTKBDotDKList.action", formData)
        .then(async ({ data }) => {
            let html = data as string;

            const rowList = html
                .slice(html.indexOf("<tr "), html.lastIndexOf("</tr>"))
                .split("<tr ")
                .slice(1, -1);
            const dotDangKyIdList = rowList.map((row) =>
                Number(row.match(/id='dotDKId(\d+)'/)?.at(1))
            );
            const dotDangKyTitleList = rowList.map(
                (row) => row.match(/<td>(.*?)<\/td>/)?.at(1) as string
            );

            // Show result
            // Clear screen
            console.log("===== Danh sách các đợt đăng ký =====");
            dotDangKyTitleList.forEach((title, index) => {
                console.log(`\t[${index + 1}] ${title}`);
            });

            // User input on terminal
            let dotDangKyIdSelectIndex = -1;

            do {
                dotDangKyIdSelectIndex =
                    Number(await readline.input("Nhập lựa chọn của bạn: ")) - 1;

                // Select values: 1 -> length
            } while (
                dotDangKyIdSelectIndex < 0 ||
                dotDangKyIdSelectIndex >= dotDangKyIdList.length
            );

            console.log(
                success(
                    `➥ Bạn đã chọn "${dotDangKyTitleList[dotDangKyIdSelectIndex]}"`
                )
            );

            setDotDangKyId(dotDangKyIdList[dotDangKyIdSelectIndex]);

            return dotDangKyId;
        });
}
