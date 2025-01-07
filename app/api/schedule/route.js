import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { dates, slots, doctorId } = await req.json();

    if (
      !dates ||
      dates.length === 0 ||
      !slots ||
      slots.length === 0 ||
      !doctorId
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    for (const dateString of dates) {
      // Перетворюємо передану дату з рядка в об'єкт дати
      const dateParts = dateString.split("T")[0].split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Місяці в JavaScript індексуються з 0
      const day = parseInt(dateParts[2], 10);

      // Створюємо нову дату з урахуванням коректного зсуву
      const adjustedDate = new Date(Date.UTC(year, month, day + 1)); // Додаємо 1 день до дати

      // Перевірка коректності дати
      if (isNaN(adjustedDate.getTime())) {
        console.error("Invalid adjusted date");
        continue;
      }

      // Оновлюємо логіку роботи з adjustedDate замість date
      const existingSchedule = await prisma.schedule.findFirst({
        where: { date: adjustedDate, doctorId },
      });

      let schedule;
      if (!existingSchedule) {
        // Якщо розкладу немає, створюємо його
        schedule = await prisma.schedule.create({
          data: {
            date: adjustedDate,
            doctorId,
          },
        });
      } else {
        schedule = existingSchedule;
      }

      // Видаляємо старі слоти, що були пов'язані з цією датою
      await prisma.slot.deleteMany({
        where: { scheduleId: schedule.id },
      });

      // Формуємо слоти
      const uniqueSlots = Array.from(
        new Set(slots.map((slot) => slot.time))
      ).map((time) => ({
        time,
        isBooked: false,
        scheduleId: schedule.id,
      }));

      // Додаємо слоти
      await prisma.slot.createMany({
        data: uniqueSlots,
      });
    }

    return NextResponse.json(
      { message: "Schedules and slots added/updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
