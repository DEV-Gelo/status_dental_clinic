import prisma from "@/lib/prisma"; // Підключення до prisma для роботи з базою даних

export async function POST(req) {
  try {
    // Отримуємо дані з запиту
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

    // Валідація даних
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !service ||
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

    // Перевірка на доступність слоту
    const existingSlot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (existingSlot.isBooked) {
      return new Response(
        JSON.stringify({ error: "Цей слот вже зайнятий. Оновіть сторінку." }),
        { status: 400 }
      );
    }

    // Формуємо об'єкт для запису
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
            patronymic: patronymic || null,
            role: "Пацієнт",
            photo: "/image-placeholder.png",
          },
        },
      },
    };

    // Використання транзакції для атомарності операцій
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
