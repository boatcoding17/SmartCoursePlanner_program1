"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import CourseCard from "./components/CourseCard";

const mockCourses = [
  { 
    id: "MJU101", 
    name: "Intro to AgTech", 
    credits: 3, 
    status: "available", 
    day: "Mon", 
    startTime: "09:00", 
    endTime: "12:00", 
    color: "bg-blue-500",
    description: "ศึกษาเกี่ยวกับความเป็นมาและแนวโน้มของเทคโนโลยีการเกษตร การนำนวัตกรรมและเทคโนโลยีสมัยใหม่มาประยุกต์ใช้ในการเพิ่มผลผลิต การจัดการฟาร์มอัจฉริยะ (Smart Farming) รวมถึงเทคโนโลยีไอโอที (IoT) และระบบอัตโนมัติในการเกษตรแม่นยำ"
  },
  { 
    id: "MJU204", 
    name: "Database Systems", 
    credits: 3, 
    status: "available", 
    day: "Tue", 
    startTime: "13:00", 
    endTime: "16:00", 
    color: "bg-purple-500",
    description: "หลักการของระบบฐานข้อมูล สถาปัตยกรรมฐานข้อมูล แบบจำลองข้อมูลในระดับต่าง ๆ การออกแบบฐานข้อมูลเชิงสัมพันธ์ด้วยการแปลงให้อยู่ในรูปปกติ (Normalization) ภาษาโครงสร้างสืบค้น (SQL) คอนคอร์เรนซีคอนโทรล และความปลอดภัยของฐานข้อมูล"
  },
  { 
    id: "MJU301", 
    name: "OOP Programming", 
    credits: 3, 
    status: "requires-prerequisite", 
    prereq: "MJU101", 
    day: "Mon", 
    startTime: "09:00", 
    endTime: "12:00", 
    color: "bg-orange-500",
    description: "แนวคิดการเขียนโปรแกรมเชิงวัตถุ ประกอบด้วย การห่อหุ้ม (Encapsulation) การสืบทอดคุณสมบัติ (Inheritance) และการพหุสัณฐาน (Polymorphism) การใช้คลาสและวัตถุ การจัดการข้อผิดพลาด (Exception Handling) และการออกแบบโปรแกรมประยุกต์ใช้งานจริง"
  },
  { 
    id: "MJU310", 
    name: "System Analysis", 
    credits: 3, 
    status: "available", 
    day: "Wed", 
    startTime: "09:00", 
    endTime: "12:00", 
    color: "bg-pink-500",
    description: "กระบวนการและวงจรการพัฒนาระบบสารสนเทศ (SDLC) การรวบรวมความต้องการของระบบ การวิเคราะห์และออกแบบระบบงานโดยใช้เครื่องมือเชิงโครงสร้างและเชิงวัตถุ (UML Diagram) การออกแบบส่วนติดต่อผู้ใช้งาน และการวางแผนบริหารโครงการซอฟต์แวร์"
  },
  { 
    id: "MJU499", 
    name: "Special Project", 
    credits: 3, 
    status: "locked", 
    day: "Thu", 
    startTime: "09:00", 
    endTime: "12:00", 
    color: "bg-red-500",
    description: "การฝึกปฏิบัติการทำโครงงานพิเศษทางด้านเทคโนโลยีสารสนเทศภายใต้การดูแลของอาจารย์ที่ปรึกษา นักศึกษาต้องวิเคราะห์ ออกแบบ พัฒนาระบบ และนำเสนอรายงานผลการดำเนินงานโครงงานอย่างเป็นระบบตามมาตรฐานวิชาการ"
  },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const getDayLabel = (day: string) => {
  const days: Record<string, string> = { Mon: "จันทร์", Tue: "อังคาร", Wed: "พุธ", Thu: "พฤหัสฯ", Fri: "ศุกร์" };
  return days[day] || day;
};

export default function PlannerPage() {
  const [selectedCourses, setSelectedCourses] = useState<typeof mockCourses>([]);
  
  // 💡 State สำหรับควบคุมการแสดงรายละเอียดวิชา (Modal)
  const [activeDetailsCourse, setActiveDetailsCourse] = useState<typeof mockCourses[0] | null>(null);

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
            conflicts.push(`⚠️ เวลาชนกัน: วิชา ${c1.id} และ ${c2.id} เรียนวัน${getDayLabel(c1.day)} ช่วงเวลาซ้อนทับกัน`);
          }
        }
      }
    }
    return conflicts;
  };

  const timeConflicts = checkTimeConflicts();

  const getCoursesAtSlot = (day: string, time: string) => {
    return selectedCourses.filter(c => c.day === day && time >= c.startTime && time < c.endTime);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12 relative">
      <Navbar studentYear="ชั้นปีที่ 2 (MIS MJU)" />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* บล็อกที่ 1: คลังรายวิชา */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">รายวิชาที่เปิดให้ทดลองเลือก</h2>
          <div className="space-y-2">
            {mockCourses.map((course) => (
              <CourseCard 
                key={course.id}
                course={course}
                isAdded={selectedCourses.some((c) => c.id === course.id)}
                onAdd={addToPlan}
                getDayLabel={getDayLabel}
                onViewDetails={(c) => setActiveDetailsCourse(c)} // สั่งเซ็ตค่าวารสารวิชาลงสเตตเพื่อเปิดเปิดป็อปอัป
              />
            ))}
          </div>
        </div>

        {/* บล็อกที่ 2: ผังตารางเรียนจำลองด้วยระบบ CSS Grid */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-4">
          {/* ... (เนื้อหาตารางเรียนคงเดิมเหมือนชุดก่อนหน้าทุกประการ) ... */}
          <h2>ผังตารางเรียนจำลองด้วยระบบ </h2>
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
                              <div><span className="font-bold block">{course.id}</span><span className="block truncate">{course.name}</span></div>
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

          {/* สรุปและปุ่มบันทึก */}
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

      {/* 💡 บล็อกหน้าต่างลอยแสดงรายละเอียดวิชา (Course Description Modal) */}
      {activeDetailsCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-amber-500/10 animate-scale-up">
            <div className="h-2 bg-gradient-to-r from-emerald-600 to-amber-500"></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded block w-fit mb-1">
                    {activeDetailsCourse.id}
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
                    <span className="font-bold text-indigo-700">วัน{getDayLabel(activeDetailsCourse.day)} {activeDetailsCourse.startTime}-{activeDetailsCourse.endTime} น.</span>
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