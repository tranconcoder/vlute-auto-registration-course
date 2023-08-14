import { vluteInstance } from "../../configs/axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { getDotDangKyId } from ".";

dotenv.config();

interface CourseRegistration {
    lopMonHocId: number;
    lopMonHocKemId?: number;
}

export default async function courseRegistration({
    lopMonHocId,
    lopMonHocKemId,
}: CourseRegistration) {
    const formData = new FormData();
    const dotDangKyId = await getDotDangKyId();

    formData.append("lopMonHocId", lopMonHocId.toString());
    formData.append("lopMonHocKemId", (lopMonHocKemId || -1).toString());
    formData.append("hocKyId", process.env.HOC_KY_ID as string);
    formData.append("dotDKId", dotDangKyId);

    return vluteInstance
        .post("/hocvien/ketQuaDangKyLopMonHocInsert.action", formData)
        .then(({ data }) => data.at(0)?.objs?.at(1) === "true")
        .catch(() => false);
}
