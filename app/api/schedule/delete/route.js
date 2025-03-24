import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { dates, doctorId } = await req.json();

    if (!dates || !Array.isArray(dates) || dates.length === 0 || !doctorId) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    let totalDeletedCount = 0;

    for (const dateString of dates) {
      const parsedDate = new Date(dateString);

      if (isNaN(parsedDate.getTime())) {
        continue; // Skip incorrect dates
      }

      const schedulesToDelete = await prisma.schedule.findMany({
        where: {
          date: parsedDate,
          doctorId: parseInt(doctorId),
        },
        select: { id: true },
      });

      if (schedulesToDelete.length > 0) {
        const scheduleIdsToDelete = schedulesToDelete.map(
          (schedule) => schedule.id
        );

        await prisma.slot.deleteMany({
          where: {
            scheduleId: {
              in: scheduleIdsToDelete,
            },
          },
        });

        const deletedSchedules = await prisma.schedule.deleteMany({
          where: {
            id: {
              in: scheduleIdsToDelete,
            },
          },
        });

        totalDeletedCount += deletedSchedules.count;
      }
    }

    if (totalDeletedCount > 0) {
      return NextResponse.json(
        { message: "Deleted successfully", deletedCount: totalDeletedCount },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No schedules found for deletion." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Server error occurred while processing request." },
      { status: 500 }
    );
  }
}
