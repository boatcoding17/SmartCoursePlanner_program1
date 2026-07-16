"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/axios"; // 📡 ดึงตัวเชื่อมสายแลน Axios ภายในมาใช้

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 ฟังก์ชันล็อกอินแบบใหม่ คุยกับ Next.js API (Serverless)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!studentId || !password) {
      setError("❌ กรุณากรอกรหัสนักศึกษาและรหัสผ่านให้ครบถ้วน");
      setIsLoading(false);
      return;
    }

    try {
      // 📡 ยิง POST request เข้าท่อตัวเราเองภายใน (/api/login)
      const response = await api.post("/login", {
        student_id: studentId,
        password: password,
      });

      // 💡 แกะค่าแบบยืดหยุ่น ถ้าหลังบ้านส่งค่ากลับมาผ่านฉลุย
      if (response.data) {
        // ดึงถังข้อมูลผู้ใช้ (รองรับทั้งแบบตรง ๆ และแบบยัดไส้ในฟิลด์ .user หรือ .student)
        const studentData = response.data.user || response.data.student || response.data;
        
        // 💾 เซฟข้อมูลนักศึกษาเก็บไว้ใน Browser (LocalStorage)
        localStorage.setItem("user", JSON.stringify(studentData));

        // ล็อกอินผ่านแล้ว เด้งไปหน้าจัดตารางเรียนหลักทันที!
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login Client Error:", err);
      
      // ❌ แสดงข้อความตามจริงจาก Next.js API หลังบ้าน
      if (err.response && err.response.data) {
        setError(`❌ ${err.response.data.message || err.response.data.error || "รหัสผ่านไม่ถูกต้อง"}`);
      } else {
        // อัปเดตคำพูดแจ้งเตือนให้ไม่ติดยี่ห้อ Laravel แล้ว
        setError("❌ ไม่สามารถเชื่อมต่อกับระบบหลังบ้าน Next.js Serverless ได้");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-950 flex flex-col justify-center items-center px-4 py-12 select-none">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-amber-500/20">
        <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-amber-500 rounded-full mb-3 text-white text-2xl font-black shadow-inner tracking-tighter">
              MJU
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 tracking-wide">Smart Course Planner</h2>
            <p className="text-xs text-amber-600 font-medium mt-1">ระบบช่วยตัดสินใจวางแผนการเรียน ม.แม่โจ้</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

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
                <label className="block text-xs font-bold text-emerald-950 tracking-wider">
                  รหัสผ่าน เช่น mju374
                </label>
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

      <p className="text-white/40 text-[10px] mt-6 tracking-wide">
        © 2026 Faculty of Science • Maejo University. All rights reserved.
      </p>
    </div>
  );
}