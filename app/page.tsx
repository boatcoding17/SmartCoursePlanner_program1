"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 💡 นำเข้า Router เพื่อใช้สั่งเปลี่ยนหน้า
import Navbar from "./components/Navbar";
import CourseCard from "./components/CourseCard";
import api from "@/src/axios"; 

interface Course {
  id: number;
  course_id: string;
  name: string;
  credits: number;
  day: string;
  start_time: string;
  end_time: string;
  status?: string;
  prereq?: string;
  description?: string;
  color: string;
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const getDayLabel = (day: string) => {
  const days: Record<string, string> = { Mon: "จันทร์", Tue: "อังคาร", Wed: "พุธ", Thu: "พฤหัสฯ", Fri: "ศุกร์" };
  return days[day] || day;
};

export default function PlannerPage() {
  const router = useRouter(); // 💡 เรียกใช้งาน Router
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [activeDetailsCourse, setActiveDetailsCourse] = useState<Course | null>(null);

  // 🛡️ 1. ระบบด่านตรวจตั๋ว: ถ้าเปิดมาแล้วไม่มีข้อมูลการล็อกอิน ให้ดีดไปหน้า Login ทันที
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login"); // 🚨 ดีดตัวกลับหน้าล็อกอิน
    }
  }, [router]);

  // 🚀 2. ยิง API ดึงข้อมูลวิชาเรียนจากคลาวด์ Supabase
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      api.get("/courses")
        .then((response) => {
          // 💡 ปรับใหม่: เนื่องจาก Supabase ดึงข้อมูลผ่าน PostgreSQL จะส่งออกมาเป็น Array รายวิชาตรงๆ 
          if (Array.isArray(response.data)) {
            setCourses(response.data);
          } else if (response.data && Array.isArray(response.data.data)) {
            // ดักเผื่อกรณีมี wrapper object ครอบในอนาคต
            setCourses(response.data.data);
          }
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวิชาเรียน:", error);
        });
    }
  }, []);

  const addToPlan = (course: Course) => {
    if (!selectedCourses.some((c) => c.course_id === course.course_id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeFromPlan = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.course_id !== courseId));
  };

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

  // 🔍 ฟังก์ชันเช็คเวลาชน
  const checkTimeConflicts = () => {
    const conflicts: string[] = [];
    for (let i = 0; i < selectedCourses.length; i++) {
      for (let j = i + 1; j < selectedCourses.length; j++) {
        const c1 = selectedCourses[i];
        const c2 = selectedCourses[j];
        if (c1.day === c2.day) {
          if (c1.start_time < c2.end_time && c2.start_time < c1.end_time) {
            conflicts.push(`⚠️ เวลาชนกัน: วิชา ${c1.course_id} และ ${c2.course_id} เรียนวัน${getDayLabel(c1.day)} ช่วงเวลาซ้อนทับกัน`);
          }
        }
      }
    }
    return conflicts;
  };

  const timeConflicts = checkTimeConflicts();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12 relative">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        
        {/* บล็อกที่ 1: คลังรายวิชาจริงจากฐานข้อมูล */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 text-emerald-800">📚 รายวิชาเอกวิทยาการคอมพิวเตอร์ที่เปิดให้เลือกเรียน</h2>
          <div className="space-y-2">
            {courses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">กำลังโหลดข้อมูลวิชาเรียนจาก Supabase...</p>
            ) : (
              courses.map((course) => (
                <CourseCard 
                  key={course.id}
                  course={course}
                  isAdded={selectedCourses.some((c) => c.course_id === course.course_id)}
                  onAdd={addToPlan}
                  getDayLabel={getDayLabel}
                  onViewDetails={(c) => setActiveDetailsCourse(c)}
                />
              ))
            )}
          </div>
        </div>

        {/* บล็อกที่ 2: ผังตารางเรียนจำลองด้วยระบบ CSS Grid */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">🗓️ ทดสอบตารางเรียน</h2>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-9 bg-gray-100 text-center text-xs font-bold text-gray-600 border-b border-gray-200">
                <div className="p-3 border-r border-gray-200 bg-gray-200/50">วัน / เวลา</div>
                {timeSlots.map(time => <div key={time} className="p-3 border-r border-gray-200 last:border-0">{time} น.</div>)}
              </div>
              <div className="divide-y divide-gray-200">
                {daysOfWeek.map(day => {
                  const coursesInDay = selectedCourses.filter(c => c.day === day);
                  return (
                    <div key={day} className="grid grid-cols-9 items-stretch min-h-[85px] relative">
                      <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">{getDayLabel(day)}</div>
                      <div className="col-span-8 grid grid-cols-8 divide-x divide-gray-200 pointer-events-none absolute inset-y-0 right-0 left-[88.88px]">
                        {[...Array(8)].map((_, i) => <div key={i} className="h-full"></div>)}
                      </div>
                      <div className="col-span-8 grid grid-cols-8 p-1 gap-1 relative min-h-[75px]">
                        {coursesInDay.map(course => {
                          const startHour = parseInt(course.start_time.substring(0, 2));
                          const endHour = parseInt(course.end_time.substring(0, 2));
                          const startColIndex = startHour - 9 + 1; 
                          const colSpan = endHour - startHour;
                          const isConflict = coursesInDay.some(other => 
                            other.id !== course.id && 
                            other.start_time < course.end_time && 
                            other.end_time > course.start_time
                          );
                          return (
                            <div 
                              key={course.id}
                              style={{ 
                                gridColumnStart: startColIndex, 
                                gridColumnEnd: startColIndex + colSpan,
                                backgroundColor: isConflict ? '#fee2e2' : course.color 
                              }}
                              className={`p-2 rounded-xl text-[10px] leading-tight flex flex-col justify-between shadow-md border relative transition-all z-10 ${
                                isConflict ? 'border-red-400 text-red-900 ring-1 ring-red-300 animate-pulse' : 'border-black/10 text-gray-900'
                              }`}
                            >
                              <div className="bg-white/80 p-1.5 rounded-lg backdrop-blur-xs pr-5">
                                <span className="font-black block text-[10px] text-emerald-800">{course.course_id}</span>
                                <span className="block font-bold text-gray-900 break-words text-[11px] mt-0.5">{course.name}</span>
                                <span className="block text-[9px] text-indigo-700 mt-1 font-medium">⏱️ {course.start_time.substring(0,5)} - {course.end_time.substring(0,5)} น.</span>
                              </div>
                              <button onClick={() => removeFromPlan(course.course_id)} className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow transition-colors">×</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 📊 บล็อกที่ 3: สรุปและผลประเมินหน่วยกิต */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">📊 สรุปการเลือกแผนเรียน</h3>
              <p className="text-xs text-gray-500 mt-0.5">คำนวณตามเกณฑ์การลงทะเบียนภาคการศึกษาปกติ ม.แม่โจ้</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block font-medium">รวมหน่วยกิตปัจจุบัน</span>
              <span className={`text-4xl font-black ${
                totalCredits < 9 ? 'text-amber-500' : 
                totalCredits > 22 ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {totalCredits} <span className="text-sm font-bold text-gray-500">/ 22 นก.</span>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <span>0 นก.</span>
              <span className="text-amber-600">⚠️ ขั้นต่ำ (9 นก.)</span>
              <span className="text-emerald-600">กำลังดี</span>
              <span className="text-red-600">🛑 ห้ามเกิน (22 นก.)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300 p-0.5 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  totalCredits < 9 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  totalCredits > 22 ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' :
                  'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}
                style={{ width: `${Math.min((totalCredits / 22) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-xs space-y-2 mt-4">
            {timeConflicts.map((conflict, idx) => (
              <div key={idx} className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 font-medium flex items-center gap-2">
                <span>{conflict}</span>
              </div>
            ))}

            {totalCredits > 0 && totalCredits < 9 && (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/70 font-medium flex flex-col gap-1">
                <span className="font-bold text-sm">⚠️ หน่วยกิตยังไม่ถึงเกณฑ์ขั้นต่ำ!</span>
                <span className="text-gray-600 font-normal">ตามระเบียบ ม.แม่โจ้ ต้องลงทะเบียนไม่น้อยกว่า 9 หน่วยกิต (ยังขาดอีก {9 - totalCredits} หน่วยกิต)</span>
              </div>
            )}

            {totalCredits > 22 && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 font-medium flex flex-col gap-1">
                <span className="font-bold text-sm">🛑 หน่วยกิตเกินเกณฑ์ขั้นสูง!</span>
                <span className="text-red-700 font-normal">คุณลงทะเบียนเกิน 22 หน่วยกิตแล้ว ระบบจะไม่อนุญาตให้บันทึก (เว้นแต่จะทำเรื่องขอเพิ่มเป็นกรณีพิเศษสำหรับผู้จะสำเร็จการศึกษา)</span>
              </div>
            )}

            {totalCredits > 0 && totalCredits >= 9 && totalCredits <= 22 && timeConflicts.length === 0 && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/50 font-medium text-sm">
                ✨ โครงสร้างเวลาและจำนวนหน่วยกิตถูกต้องตามเกณฑ์ เข้าเงื่อนไขลงทะเบียนปกติเรียบร้อยครับ
              </div>
            )}
          </div>

        </div>

      </div>

      {/* บล็อกรายละเอียดวิชา (Modal) */}
      {activeDetailsCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-amber-500/10">
            <div className="h-2 bg-gradient-to-r from-emerald-600 to-amber-500"></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded block w-fit mb-1">
                    {activeDetailsCourse.course_id}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">{activeDetailsCourse.name}</h3>
                </div>
                <button 
                  onClick={() => setActiveDetailsCourse(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg p-1 bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">คำอธิบายรายวิชา (Course Description)</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {activeDetailsCourse.description || "ไม่มีข้อมูลคำอธิบายรายวิชาสำหรับวิชานี้"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                  <div>
                    <span className="text-gray-500 block">หน่วยกิต:</span>
                    <span className="font-bold text-gray-800">{activeDetailsCourse.credits} หน่วยกิต</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">เวลาเรียน:</span>
                    <span className="font-bold text-indigo-700">วัน{getDayLabel(activeDetailsCourse.day)} {activeDetailsCourse.start_time.substring(0,5)}-{activeDetailsCourse.end_time.substring(0,5)} น.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveDetailsCourse(null)}
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}