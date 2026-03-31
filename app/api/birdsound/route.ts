import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "no name" }, { status: 400 });

  const parts = name.trim().split(" ");
  const gen = parts[0];
  const sp = parts[1] || "";
  const query = sp ? `gen:${gen}+sp:${sp}` : `gen:${gen}`;

  const key = process.env.XENO_CANTO_API_KEY;
  const res = await fetch(
    `https://xeno-canto.org/api/3/recordings?query=${query}+cnt:germany&key=${key}`
  );
  const data = await res.json();
  const recording = data.recordings?.[0];
  if (!recording) return NextResponse.json({ error: "not found" }, { status: 404 });

  const file = recording.file.startsWith("http") ? recording.file : `https:${recording.file}`;

  return NextResponse.json({
    file,
    rec: recording.rec,
    loc: recording.loc,
    type: recording.type,
  });
}
