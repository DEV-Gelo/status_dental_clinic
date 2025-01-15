import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { slotIds } = await req.json();

    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format. Slot IDs are required." },
        { status: 400 }
      );
    }

    // Отримуємо список scheduleId для переданих слотів
    const relatedSchedules = await prisma.slot.findMany({
      where: {
        id: { in: slotIds },
      },
      select: {
        scheduleId: true,
      },
    });

    // Витягуємо унікальні scheduleId
    const scheduleIds = [
      ...new Set(relatedSchedules.map((slot) => slot.scheduleId)),
    ];

    // Використовуємо транзакцію для атомарних операцій
    const result = await prisma.$transaction(async (prisma) => {
      // Видаляємо слоти
      const deletedSlots = await prisma.slot.deleteMany({
        where: {
          id: { in: slotIds },
        },
      });

      // Перевіряємо, чи залишилися слоти для кожного scheduleId
      for (const scheduleId of scheduleIds) {
        const remainingSlots = await prisma.slot.count({
          where: { scheduleId },
        });

        // Якщо залишилося 0 слотів, видаляємо записи з таблиць Appointment та Schedule
        if (remainingSlots === 0) {
          // Видаляємо всі Appointment, пов'язані з цим Schedule
          await prisma.appointment.deleteMany({
            where: { scheduleId },
          });

          // Видаляємо сам Schedule
          await prisma.schedule.delete({
            where: { id: scheduleId },
          });
        }
      }

      return deletedSlots;
    });

    if (result.count > 0) {
      return NextResponse.json(
        {
          message: "Slots and related schedules deleted successfully",
          deletedCount: result.count,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No slots found for the provided IDs." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error deleting slots:", error);
    return NextResponse.json(
      { error: "Server error occurred while processing request." },
      { status: 500 }
    );
  }
}
