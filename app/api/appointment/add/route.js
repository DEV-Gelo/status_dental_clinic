import prisma from "@/lib/prisma"; // Connecting to prisma to work with the database

export async function POST(req) {
  try {
    // Receive data from the request
    const body = await req.json();
    const {
      firstName,
      lastName,
      patronymic,
      phone,
      email,
      service,
      time,
      date,
      scheduleId,
      doctorId,
      slotId,
    } = body;

    // Validation data
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !date ||
      !time ||
      !doctorId ||
      !scheduleId ||
      !slotId
    ) {
      return new Response(JSON.stringify({ error: "Заповніть усі поля" }), {
        status: 400,
      });
    }

    // Check for slot availability
    const existingSlot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (existingSlot.isBooked) {
      return new Response(
        JSON.stringify({ error: "Цей слот вже зайнятий. Оновіть сторінку." }),
        { status: 400 }
      );
    }

    // Create an object for recording
    const appointmentData = {
      firstName,
      lastName,
      patronymic: patronymic || "",
      phone,
      email,
      service,
      date: new Date(date),
      time,
      slotId,
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      schedule: {
        connect: {
          id: scheduleId,
        },
      },
      user: {
        connectOrCreate: {
          where: {
            email: email,
          },
          create: {
            firstName,
            lastName,
            email,
            phone,
            patronymic: patronymic || "",
            role: "patient",
            photo: "/image-placeholder.png",
          },
        },
      },
    };

    // Using transaction for atomicity of operations
    const [newAppointment, _] = await prisma.$transaction([
      prisma.appointment.create({
        data: appointmentData,
      }),
      prisma.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      }),
    ]);

    return new Response(
      JSON.stringify({
        message: "Запис успішно створено!",
        appointment: newAppointment,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Помилка при створенні запису:", error.message);
    return new Response(
      JSON.stringify({ error: "Сталася помилка при створенні запису" }),
      { status: 500 }
    );
  }
}
