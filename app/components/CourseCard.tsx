"use client";

interface Course {
  id: string;
  name: string;
  credits: number;
  status: string;
  day: string;
  startTime: string;
  endTime: string;
  prereq?: string;
}

interface CourseCardProps {
  course: Course;
  isAdded: boolean;
  onAdd: (course: Course) => void;
  getDayLabel: (day: string) => string;
}

export default function CourseCard({ course, isAdded, onAdd, getDayLabel }: CourseCardProps) {
  return (
    <div className={`p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center hover:border-emerald-300 transition-all ${
      course.status === 'locked' ? 'bg-gray-50 border-gray-200 opacity-60' : 
      course.status === 'requires-prerequisite' ? 'bg-amber-50/40 border-amber-200' : 'bg-white'
    }`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{course.id}</span>
          <span className="text-sm font-semibold text-gray-900">{course.name}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {course.credits} นก. | <span className="text-indigo-600">วัน{getDayLabel(course.day)} {course.startTime}-{course.endTime} น.</span>
          {course.prereq && <span className="text-amber-600 font-medium ml-2">⚠️ ต้องผ่าน {course.prereq}</span>}
        </p>
      </div>
      
      {course.status !== 'locked' ? (
        <button
          onClick={() => onAdd(course)}
          disabled={isAdded}
          className={`text-xs font-medium px-4 py-2 rounded-lg transition-all ${
            isAdded ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isAdded ? 'เลือกแล้ว' : '+ เพิ่มเข้าตาราง'}
        </button>
      ) : (
        <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-medium">🔒 ล็อก</span>
      )}
    </div>
  );
}