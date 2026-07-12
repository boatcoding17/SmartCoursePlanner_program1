"use client";

interface NavbarProps {
  studentYear?: string;
}

export default function Navbar({ studentYear = "ชั้นปีที่ 2 (MIS MJU)" }: NavbarProps) {
  return (
    <nav className="bg-emerald-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Smart Course Planner</h1>
        <p className="text-xs text-emerald-200">ระบบช่วยตัดสินใจวางแผนการเรียน ม.แม่โจ้</p>
      </div>
      <div className="text-sm bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-600">
        {studentYear}
      </div>
    </nav>
  );
}