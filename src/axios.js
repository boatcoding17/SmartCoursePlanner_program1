import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // 🚀 ชี้เป้ามาที่ Laravel API ของเรา
    withCredentials: true, // อนุญาตให้ส่งคุกกี้/ข้อมูลความปลอดภัยข้ามระบบได้
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;