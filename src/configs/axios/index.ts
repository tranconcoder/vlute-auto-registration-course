import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const courseRegistrationInstance = axios.create({
    baseURL:
        "https://qldt.vlute.edu.vn/VLUTE-Web/hocvien",
});

export { courseRegistrationInstance };
