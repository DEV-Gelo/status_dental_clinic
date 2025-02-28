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

    // Get the scheduleId list for the transferred slots
    const relatedSchedules = await prisma.slot.findMany({
      where: {
        id: { in: slotIds },
      },
      select: {
        scheduleId: true,
      },
    });

    // Extract the unique scheduleId
    const scheduleIds = [
      ...new Set(relatedSchedules.map((slot) => slot.scheduleId)),
    ];

    // Use a transaction for atomic operations
    const result = await prisma.$transaction(async (prisma) => {
      // Remove the slots
      const deletedSlots = await prisma.slot.deleteMany({
        where: {
          id: { in: slotIds },
        },
      });

      // Check whether there are slots left for each scheduleId
      for (const scheduleId of scheduleIds) {
        const remainingSlots = await prisma.slot.count({
          where: { scheduleId },
        });

        // If there are 0 slots left, delete entries from the Appointment and Schedule tables
        if (remainingSlots === 0) {
          // Delete all Appointments related to this Schedule
          await prisma.appointment.deleteMany({
            where: { scheduleId },
          });

          // Delete the Schedule
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
