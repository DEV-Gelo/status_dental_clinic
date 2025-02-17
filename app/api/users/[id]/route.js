import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params; // Отримуємо ID користувача з URL

  try {
    const today = new Date(); // Поточна дата
    today.setHours(0, 0, 0, 0); // Обнуляємо час для порівняння тільки по даті

    // Перевірити, чи користувач є лікарем
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    if (user.role === "doctor") {
      // Перевірити майбутні графіки лікаря зі слотами isBooked: true
      const hasFutureBookedSchedules = await prisma.schedule.findFirst({
        where: {
          doctorId: Number(id),
          date: {
            gte: today, // Тільки сьогоднішні та майбутні дати
          },
          slots: {
            some: {
              isBooked: true, // Слоти, які заброньовані
            },
          },
        },
      });

      if (hasFutureBookedSchedules) {
        return new Response(
          JSON.stringify({
            error: "Cannot delete doctor with future booked schedules",
          }),
          { status: 400 }
        );
      }
    }

    // Знайти всі записи користувача
    const userAppointments = await prisma.appointment.findMany({
      where: {
        userId: Number(id),
      },
      select: {
        slotId: true, // Отримуємо ID слота, пов'язаного з записом
      },
    });

    // Оновити слоти, встановивши isBooked: false
    const slotUpdates = userAppointments
      .filter((appointment) => appointment.slotId) // Перевіряємо, чи slotId не null
      .map((appointment) =>
        prisma.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        })
      );

    // Виконати всі оновлення слотів паралельно
    await Promise.all(slotUpdates);

    // Видалити користувача
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to delete user or update slots" }),
      {
        status: 500,
      }
    );
  }
}
