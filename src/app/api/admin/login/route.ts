import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
    }
    await createSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
