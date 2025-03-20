import prisma from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function DELETE(req, { params }) {
  const { id } = params; // Get the user ID from the URL

  // --- Delete photo from storage ----//
  // Getting the path to the photo from the database
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { photo: true }, // Get only photo field
  });
  const fileUrl = user.photo;

  // Trim part of the URL to get only the path to the file in the bucket
  const filePath = fileUrl
    .replace("blob:http://", "blob:http:/") // Remove the extra "/"
    .split("supabase.co/storage/v1/object/public/uploads")[1] // Extract the part after "uploads/"
    ?.replace(/^\/+/, ""); //Remove extra slashes at the beginning

  // Delete previous file
  const { dataDelete, deleteError } = await supabase.storage
    .from("uploads")
    .remove([filePath]);

  if (deleteError) {
    console.error("Error deleting old file:", deleteError.message);
  } else {
    console.log("Old file deleted successfully!");
  }

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
