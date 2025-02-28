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

    // Obtaining a previous record
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: { slot: true }, // Get the associated slot
    });

    // Transaction for several operations
    const updatedAppointment = await prisma.$transaction(async (tx) => {
      // Update the previous slot to isBooked: false if it exists
      if (existingAppointment.slot) {
        await tx.slot.update({
          where: { id: existingAppointment.slot.id },
          data: { isBooked: false },
        });
      }

      // Find a new slot by time and date
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
        throw new Error("A slot with the specified parameters was not found");
      }

      // Updating a new slot on isBooked: true
      await tx.slot.update({
        where: { id: newSlot.id },
        data: { isBooked: true },
      });

      // Update the Appointment with the binding to the new slot
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
