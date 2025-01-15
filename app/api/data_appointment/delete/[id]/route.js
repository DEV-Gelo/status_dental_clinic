import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Find the entry and slot, if any
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: { slot: true },
    });

    if (!appointment) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404,
      });
    }

    // Update the slot if it exists
    if (appointment.slotId) {
      await prisma.slot.update({
        where: { id: appointment.slotId },
        data: {
          isBooked: false,
          appointmentId: null, // Remove the link from the record
        },
      });
    }

    // Delete entry
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify(deletedAppointment), { status: 200 });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete appointment" }),
      { status: 500 }
    );
  }
}
