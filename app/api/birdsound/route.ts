import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "no name" }, { status: 400 });

  const res = await fetch(
    `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(name)}+cnt:germany&page=1`,
    { headers: { "User-Agent": "BirdCollect/1.0" } }
  );
  const data = await res.json();
  const recording = data.recordings?.[0];
  if (!recording) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({
    file: `https:${recording.file}`,
    rec: recording.rec,
    loc: recording.loc,
  });
}
