// файл: app/api/data_appointment/delete/[id]/route.js
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Знайти запис і слот, якщо такі є
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: { slot: true },
    });

    if (!appointment) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404,
      });
    }

    // Оновити слот, якщо він існує
    if (appointment.slotId) {
      await prisma.slot.update({
        where: { id: appointment.slotId },
        data: {
          isBooked: false,
          appointmentId: null, // Видалити зв'язок із записом
        },
      });
    }

    // Видалити запис
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
