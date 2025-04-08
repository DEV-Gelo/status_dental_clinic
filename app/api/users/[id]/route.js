import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT, // Wasabi endpoint
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

export async function DELETE(req, { params }) {
  const { id } = params; // Get the user ID from the URL

  try {
    // --- Delete photo from storage ----//
    // Getting the path to the photo from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { photo: true, role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // --- Check if the user has future scheduled appointments (if doctor) ----//
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time for comparison only by date

    if (user.role === "doctor") {
      const hasFutureBookedSchedules = await prisma.schedule.findFirst({
        where: {
          doctorId: Number(id),
          date: { gte: today }, // Only today and future dates
          slots: { some: { isBooked: true } }, // Slots that are booked
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

    // --- Update appointments and slots before deleting ----//
    const userAppointments = await prisma.appointment.findMany({
      where: { userId: Number(id) },
      select: { slotId: true },
    });

    // Update slots to unbooked before deletion
    const slotUpdates = userAppointments
      .filter((appointment) => appointment.slotId)
      .map((appointment) =>
        prisma.slot.update({
          where: { id: appointment.slotId },
          data: { isBooked: false },
        })
      );

    await Promise.all(slotUpdates);

    // --- Delete user photo from storage ----//
    const fileUrl = user.photo;
    const fileKey = fileUrl.split("/").pop(); // Get the filename part from the URL

    if (fileKey) {
      const deleteParams = {
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams));
    }

    // --- Delete the user record ----//
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    console.error("Error deleting user or updating slots:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to delete user or update slots" }),
      { status: 500 }
    );
  }
}
