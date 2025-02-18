import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "doctor", // Get only doctors
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        patronymic: true,
        photo: true,
        specialization: true,
      },
    });
    return new Response(JSON.stringify(doctors), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
