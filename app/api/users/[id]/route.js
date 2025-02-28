import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params; // Get the user ID from the URL

  try {
    const today = new Date(); // Current date
    today.setHours(0, 0, 0, 0); // Reset the time for comparison only by date

    // Check if the user is a doctor
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
      // Check future doctor schedules with slots isBooked: true
      const hasFutureBookedSchedules = await prisma.schedule.findFirst({
        where: {
          doctorId: Number(id),
          date: {
            gte: today, // Only today and future dates
          },
          slots: {
            some: {
              isBooked: true, // Slots that are booked
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

    // Find all user records
    const userAppointments = await prisma.appointment.findMany({
      where: {
        userId: Number(id),
      },
      select: {
        slotId: true, // Get the ID of the slot associated with the recording
      },
    });

    // Update slots by setting isBooked: false
    const slotUpdates = userAppointments
      .filter((appointment) => appointment.slotId) // Check whether slotId is not null
      .map((appointment) =>
        prisma.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        })
      );

    // Perform all slot updates in parallel
    await Promise.all(slotUpdates);

    // Delete user
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
