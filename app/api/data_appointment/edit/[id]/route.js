import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params; // Get the ID from the URL parameters

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  try {
    // Get the user by ID
    const data_appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id, 10) },
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

    if (data_appointment) {
      return new Response(JSON.stringify(data_appointment), { status: 200 });
    } else {
      return new Response("Record not found", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
