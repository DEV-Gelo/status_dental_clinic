import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const {
      id,
      firstName,
      lastName,
      patronymic,
      phone,
      date,
      time,
      service,
      doctor,
    } = data;

    // Отримання попереднього запису
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: { slot: true }, // Отримуємо пов'язаний слот
    });

    // Починаємо транзакцію для кількох операцій
    const updatedAppointment = await prisma.$transaction(async (tx) => {
      // Оновлюємо попередній слот на isBooked: false, якщо він існує
      if (existingAppointment.slot) {
        await tx.slot.update({
          where: { id: existingAppointment.slot.id },
          data: { isBooked: false },
        });
      }

      // Знаходимо новий слот за часом і датою
      const newSlot = await tx.slot.findFirst({
        where: {
          time,
          schedule: {
            date: new Date(date),
            doctorId: Number(doctor),
          },
        },
      });

      if (!newSlot) {
        throw new Error("Слот із вказаними параметрами не знайдено");
      }

      // Оновлюємо новий слот на isBooked: true
      await tx.slot.update({
        where: { id: newSlot.id },
        data: { isBooked: true },
      });

      // Оновлюємо Appointment із прив'язкою до нового слота
      return tx.appointment.update({
        where: { id: Number(id) },
        data: {
          firstName,
          lastName,
          patronymic,
          phone,
          date: new Date(date),
          time,
          service,
          doctor: {
            connect: { id: Number(doctor) },
          },
          slot: {
            connect: { id: newSlot.id },
          },
        },
      });
    });

    return new Response(JSON.stringify(updatedAppointment), { status: 200 });
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update appointment" }),
      {
        status: 500,
      }
    );
  }
}
