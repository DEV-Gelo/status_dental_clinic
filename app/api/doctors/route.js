import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "Лікар", // Get only doctors
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        patronymic: true,
        photo: true,
      },
    });
    return new Response(JSON.stringify(doctors), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Помилка сервера" }), {
      status: 500,
    });
  }
}
