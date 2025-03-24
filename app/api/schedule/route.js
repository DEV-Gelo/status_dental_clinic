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
      // Convert the transferred date from a string into a date object
      const parsedDate = new Date(dateString);

      // Checking the correctness of the date
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid adjusted date");
        continue;
      }

      //Update the logic of working with adjustedDate instead of date
      const existingSchedule = await prisma.schedule.findFirst({
        where: { date: parsedDate, doctorId },
      });

      let schedule;
      if (!existingSchedule) {
        // If there is no schedule, create it
        schedule = await prisma.schedule.create({
          data: {
            date: parsedDate,
            doctorId,
          },
        });
      } else {
        schedule = existingSchedule;
      }

      // Delete the old slots that were associated with this date
      await prisma.slot.deleteMany({
        where: { scheduleId: schedule.id },
      });

      // Form slots
      const uniqueSlots = Array.from(
        new Set(slots.map((slot) => slot.time))
      ).map((time) => ({
        time,
        isBooked: false,
        scheduleId: schedule.id,
      }));

      // Add slots
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
