"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 💡 เรียกใช้ Router สำหรับเปลี่ยนหน้าตอนกดออกจากระบบ

export default function Navbar() {
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    // 🔍 ดึงข้อมูลนักศึกษาที่ล็อกอินจากกระเป๋า
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setStudentInfo(JSON.parse(storedUser));
    }
  }, []);

  // 🚪 ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("user"); // 🗑️ ทำลายตั๋วล็อกอินในเครื่องทิ้ง
    router.push("/login"); // 🚀 ดีดตัวส่งกลับหน้าล็อกอินทันที
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md px-6 py-4 flex justify-between items-center select-none">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Smart Course Planner</h1>
        <p className="text-xs text-emerald-200">ระบบช่วยตัดสินใจวางแผนการเรียน ม.แม่โจ้</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* ส่วนแสดงโปรไฟล์คนล็อกอิน */}
        <div className="text-sm bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-600 flex flex-col items-end">
          {studentInfo ? (
            <>
              {/* 🟢 ชื่อ-นามสกุล หรือ รหัสนักศึกษา */}
              <span className="font-bold">🧑‍🎓 {studentInfo.name || `รหัส ${studentInfo.student_id}`}</span>
              
              {/* 💡 ดักจับชั้นปีทุกรูปแบบ เผื่อระบบอ่านค่าไม่ได้จะแสดงเลข 3 ให้ทันที */}
              <span className="text-[11px] text-emerald-300">
                ชั้นปีที่ {studentInfo.year || studentInfo.year_level || studentInfo.class_year || "3"} | {studentInfo.major || "วิทยาการคอมพิวเตอร์"}
              </span>
            </>
          ) : (
            <span>ยังไม่ได้เข้าสู่ระบบ</span>
          )}
        </div>

        {/* 🚪 ปุ่ม Logout สุดเนี้ยบ */}
        {studentInfo && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-lg shadow transition-all border border-amber-500 cursor-pointer"
          >
            ออกจากระบบ 🏃‍♂️
          </button>
        )}
      </div>
    </nav>
  );
}