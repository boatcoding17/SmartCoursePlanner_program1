"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/axios"; // 🚀 1. ดึงตัวเชื่อมสายแลน Axios ที่เราสร้างไว้มาใช้

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 2. ปรับฟังก์ชันล็อกอินให้ยิง API ไปหา Laravel จริง
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!studentId || !password) {
      setError("❌ กรุณากรอกรหัสนักศึกษาและรหัสผ่านให้ครบถ้วน");
      setIsLoading(false);
      return;
    }

    try {
      // 📡 ยิง POST request ข้ามไปที่หลังบ้าน Laravel (http://127.0.0.1:8000/api/login)
      const response = await api.post("/login", {
        student_id: studentId,
        password: password,
      });

      if (response.data.status === "success") {
        const studentData = response.data.student;
        
        // 💡 [Trick] เซฟข้อมูลนักศึกษาเก็บไว้ใน Browser (LocalStorage) 
        // หน้าอื่นจะได้ดึงไปโชว์ได้ว่า "ยินดีต้อนรับ คุณสมันตชัย"
        localStorage.setItem("user", JSON.stringify(studentData));

        // ล็อกอินผ่านแล้ว เด้งไปหน้าจัดตารางเรียนหลักทันที!
        router.push("/");
      }
    } catch (err: any) {
      // ❌ ถ้ารหัสผิด หรือหลังบ้านมีปัญหาจะตกมาที่นี่
      if (err.response && err.response.data) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ ไม่สามารถเชื่อมต่อกับระบบหลังบ้าน Laravel ได้");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-950 flex flex-col justify-center items-center px-4 py-12 select-none">
      
      {/* การ์ดกล่องล็อกอินหลัก */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-amber-500/20">
        
        {/* แถบสีทองและโลโก้จำลองด้านบนสุดของการ์ด */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>
        
        <div className="p-8">
          {/* หัวข้อและตราสัญลักษณ์จำลอง */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-amber-500 rounded-full mb-3 text-white text-2xl font-black shadow-inner tracking-tighter">
              MJU
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 tracking-wide">Smart Course Planner</h2>
            <p className="text-xs text-amber-600 font-medium mt-1">ระบบช่วยตัดสินใจวางแผนการเรียน ม.แม่โจ้</p>
          </div>

          {/* ข้อความแสดงข้อผิดพลาด (ถ้ามี) */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* ฟอร์มกรอกข้อมูล */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
                รหัสนักศึกษา
              </label>
              <input
                type="text"
                placeholder="เช่น 6604101xxx"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-gray-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  รหัสผ่าน (MIS MJU)
                </label>
                <a href="#" className="text-[11px] text-amber-600 hover:underline font-medium">ลืมรหัสผ่าน?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-gray-800"
              />
            </div>

            {/* ส่วนเลือกจดจำฉัน */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-gray-600 font-medium cursor-pointer">
                จดจำการเข้าสู่ระบบในเครื่องนี้
              </label>
            </div>

            {/* ปุ่มล็อกอิน */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg hover:from-emerald-800 hover:to-emerald-950 transition-all focus:outline-none transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center border border-emerald-600/30 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังตรวจสอบข้อมูล...</span>
                </div>
              ) : (
                "เข้าสู่ระบบด้วยบัญชีแม่โจ้"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* เครดิตเล็ก ๆ ท้ายหน้า */}
      <p className="text-white/40 text-[10px] mt-6 tracking-wide">
        © 2026 Faculty of Science • Maejo University. All rights reserved.
      </p>
    </div>
  );
}