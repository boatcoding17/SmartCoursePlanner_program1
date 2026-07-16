import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // 🔍 ดึงข้อมูลวิชาเรียนทั้งหมดจากตาราง courses ตัวล่าสุด
    const result = await pool.query('SELECT * FROM courses');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Courses Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}