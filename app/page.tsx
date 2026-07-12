"use client";

import { useState } from "react";
// 1. เรียกใช้งานชิ้นส่วนที่เราแยกสร้างไว้ในโฟลเดอร์ components
import Navbar from "./components/Navbar";
import CourseCard from "./components/CourseCard";

const mockCourses = [
  { id: "MJU101", name: "Intro to AgTech", credits: 3, status: "available", day: "Mon", startTime: "09:00", endTime: "12:00", color: "bg-blue-500" },
  { id: "MJU204", name: "Database Systems", credits: 3, status: "available", day: "Tue", startTime: "13:00", endTime: "16:00", color: "bg-purple-500" },
  { id: "MJU301", name: "OOP Programming", credits: 3, status: "requires-prerequisite", prereq: "MJU101", day: "Mon", startTime: "09:00", endTime: "12:00", color: "bg-orange-500" },
  { id: "MJU310", name: "System Analysis", credits: 3, status: "available", day: "Wed", startTime: "09:00", endTime: "12:00", color: "bg-pink-500" },
  { id: "MJU499", name: "Special Project", credits: 3, status: "locked", day: "Thu", startTime: "09:00", endTime: "12:00", color: "bg-red-500" },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const getDayLabel = (day: string) => {
  const days: Record<string, string> = { Mon: "จันทร์", Tue: "อังคาร", Wed: "พุธ", Thu: "พฤหัสฯ", Fri: "ศุกร์" };
  return days[day] || day;
};

export default function PlannerPage() {
  const [selectedCourses, setSelectedCourses] = useState<typeof mockCourses>([]);

  const addToPlan = (course: typeof mockCourses[0]) => {
    if (!selectedCourses.some((c) => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeFromPlan = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);

  const checkTimeConflicts = () => {
    const conflicts: string[] = [];
    for (let i = 0; i < selectedCourses.length; i++) {
      for (let j = i + 1; j < selectedCourses.length; j++) {
        const c1 = selectedCourses[i];
        const c2 = selectedCourses[j];
        if (c1.day === c2.day) {
          const start1 = c1.startTime;
          const end1 = c1.endTime;
          const start2 = c2.startTime;
          const end2 = c2.endTime;
          if (start1 < end2 && start2 < end1) {
            conflicts.push(`⚠️ เวลาชนกัน: ${c1.id} และ ${c2.id} (วัน${getDayLabel(c1.day)} ช่วงเช้า)`);
          }
        }
      }
    }
    return conflicts;
  };

  const timeConflicts = checkTimeConflicts();

  const getCoursesAtSlot = (day: string, time: string) => {
    return selectedCourses.filter(c => time >= c.startTime && time < c.endTime && c.day === day);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      {/* 2. นำ Component Navbar มาแปะใช้งาน */}
      <Navbar studentYear="ชั้นปีที่ 2 (MIS MJU)" />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        
        {/* ส่วนที่ 1: คลังรายวิชา */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">รายวิชาที่เปิดให้ทดลองเลือก</h2>
          <div className="space-y-2">
            {mockCourses.map((course) => (
              /* 3. เรียกใช้ชิ้นส่วนการ์ดรายวิชาและส่งข้อมูลแบบพรอพ (Props) */
              <CourseCard 
                key={course.id}
                course={course}
                isAdded={selectedCourses.some((c) => c.id === course.id)}
                onAdd={addToPlan}
                getDayLabel={getDayLabel}
              />
            ))}
          </div>
        </div>

        {/* ส่วนที่ 2: ผังตารางเรียนจำลอง */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-bold text-gray-900">ผังตารางเรียนจำลอง</h2>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">รวม {totalCredits} / 22 นก.</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-9 bg-gray-100 text-center text-xs font-bold text-gray-600 border-b border-gray-200">
                <div className="p-3 border-r border-gray-200 bg-gray-200/50">วัน / เวลา</div>
                {timeSlots.map(time => <div key={time} className="p-3 border-r border-gray-200 last:border-0">{time} น.</div>)}
              </div>

              <div className="divide-y divide-gray-200">
                {daysOfWeek.map(day => (
                  <div key={day} className="grid grid-cols-9 items-stretch min-h-[75px]">
                    <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">{getDayLabel(day)}</div>
                    {timeSlots.map(time => {
                      const slotCourses = getCoursesAtSlot(day, time);
                      const hasConflict = slotCourses.length > 1;
                      return (
                        <div key={time} className={`border-r border-gray-200 last:border-0 p-1 flex flex-col gap-1 relative group justify-center transition-colors ${hasConflict ? 'bg-red-50/50' : 'bg-white hover:bg-gray-50/80'}`}>
                          {slotCourses.map(course => (
                            <div key={course.id} className={`p-1 rounded text-[9px] leading-tight flex flex-col justify-between shadow-sm border text-white relative ${course.color} ${hasConflict ? 'border-red-400 ring-1 ring-red-300 animate-pulse' : 'border-transparent'}`}>
                              <div>
                                <span className="font-bold block">{course.id}</span>
                                <span className="block truncate">{course.name}</span>
                              </div>
                              <button onClick={() => removeFromPlan(course.id)} className="absolute top-0.5 right-0.5 bg-black/20 hover:bg-black/60 text-white rounded-full w-3 h-3 flex items-center justify-center text-[7px]">×</button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedCourses.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-2 text-xs">
              <h3 className="font-bold text-gray-600 uppercase tracking-wider">📊 ผลประเมินตารางเรียน</h3>
              {timeConflicts.length === 0 && <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">✨ โครงสร้างเวลาถูกต้อง ไม่มีวิชาเรียนซ้ำซ้อนกัน</div>}
              {timeConflicts.map((conflict, idx) => <div key={idx} className="p-2 bg-red-50 text-red-800 rounded-lg border border-red-200 font-medium">{conflict}</div>)}
            </div>
          )}

          <button disabled={selectedCourses.length === 0 || timeConflicts.length > 0} className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${(selectedCourses.length === 0 || timeConflicts.length > 0) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'}`}>
            ยืนยันบันทึกแผนตารางเรียนนี้
          </button>
        </div>

      </div>
    </div>
  );
}