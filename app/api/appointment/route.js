import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return new Response(JSON.stringify({ error: "Date not found." }), {
        status: 400,
      });
    }

    // Отримання початку і кінця доби
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Отримання лікарів з розкладом і слотами
    const doctors = await prisma.user.findMany({
      where: {
        role: "doctor",
        schedules: {
          some: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      include: {
        schedules: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            slots: {
              where: { isBooked: false },
            },
          },
        },
      },
    });

    if (doctors.length === 0) {
      return new Response(
        JSON.stringify({
          error: "There are no doctors available on this date.",
        }),
        { status: 200 }
      );
    }

    // Formation of the answer
    const doctorsWithTimes = doctors
      .map((doctor) => ({
        doctorId: doctor.id,
        doctorName: `${doctor.lastName} ${doctor.firstName} ${doctor.patronymic}`,
        specialization: doctor.specialization,
        photo: doctor.photo || "/image-placeholder.png",
        availableTimes: doctor.schedules.flatMap((schedule) =>
          schedule.slots.map((slot) => ({
            time: slot.time,
            scheduleId: schedule.id,
            slotId: slot.id,
          }))
        ),
      }))
      .filter((doctor) => doctor.availableTimes.length > 0); // Filter doctors without available slots

    return new Response(JSON.stringify(doctorsWithTimes), { status: 200 });
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: "There was an error getting the schedule." }),
      { status: 500 }
    );
  }
}
