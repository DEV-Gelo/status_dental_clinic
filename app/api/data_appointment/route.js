import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data_appointment = await prisma.appointment.findMany({
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            patronymic: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(data_appointment), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching users", { status: 500 });
  }
}
