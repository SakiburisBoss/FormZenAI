import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (session) return NextResponse.json({ ok: true });

  const { headers: returnedHeaders } = await auth.api.signInAnonymous({
    headers: hdrs,
    returnHeaders: true,
  });

  const setCookie = returnedHeaders.get("set-cookie");
  const res = NextResponse.json({ ok: true });
  if (setCookie) res.headers.set("Set-Cookie", setCookie);

  return res;
}
