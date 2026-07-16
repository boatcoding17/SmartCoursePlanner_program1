import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 🔌 สร้างการเชื่อมต่อโดยดึงลิงก์จาก .env.local ที่คู่หูเพิ่งแปะไป
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { student_id, password } = await request.json();

    if (!student_id || !password) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // 🔍 วิ่งไปค้นหานักศึกษาจากตาราง students บนคลาวด์ Supabase
    const result = await pool.query('SELECT * FROM students WHERE student_id = $1 LIMIT 1', [student_id]);
    const user = result.rows[0];

    // ❌ ถ้ารหัสผิดหรือไม่พบข้อมูลในตาราง
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    // 🟢 รวมชื่อและนามสกุลที่แยกกันอยู่ในตาราง ให้กลายเป็นก้อนเดียว
    const fullName = `${user.first_name} ${user.last_name}`;

    return NextResponse.json({
      status: "success",
      id: user.student_id,
      name: fullName, 
      student_id: user.student_id,
      major: user.major,
      faculty: user.faculty,
      year: user.year,
      student: {
        id: user.student_id,
        name: fullName,
        student_id: user.student_id
      }
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}