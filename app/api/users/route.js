import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findMany();
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching users", { status: 500 });
  }
}
