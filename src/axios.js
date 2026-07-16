import axios from 'axios';

const api = axios.create({
    // 💡 เปลี่ยนมาชี้เข้าหาโฟลเดอร์ api ใน Next.js ตัวเราเอง
    baseURL: '/api', 
    // 💡 เอาออกได้เลยครับ เพราะอยู่บนโดเมนเดียวกันแล้ว ไม่ต้องแชร์ Cookie ข้ามค่าย
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;