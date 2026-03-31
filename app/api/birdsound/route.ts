import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "no name" }, { status: 400 });

  const res = await fetch(
    `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(name)}+cnt:germany`,
    { headers: { "Authorization": `Bearer ${process.env.XENO_CANTO_API_KEY}` } }
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
