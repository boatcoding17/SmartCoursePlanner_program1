import axios from 'axios';

const api = axios.create({
    // 🚀 เปลี่ยนจาก localhost เป็นลิงก์ Render ตัวจริงของเรา
    baseURL: 'https://smartcourseplanner-program1b.onrender.com/api', 
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;