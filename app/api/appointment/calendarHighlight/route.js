import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function GET(req) {
  try {
    // Get all dates with schedule and slots
    const schedules = await prisma.schedule.findMany({
      where: {
        slots: {
          some: {
            isBooked: false, // Only available slots
          },
        },
      },
      select: {
        date: true, // Date field only
      },
    });

    // Forming a unique list of dates
    const uniqueDates = [
      ...new Set(
        schedules.map((schedule) => {
          const date = new Date(schedule.date);
          date.setHours(0, 0, 0, 0);
          return date.toLocaleDateString("uk-UA");
        })
      ),
    ];
    if (uniqueDates.length === 0) {
      return new Response(
        JSON.stringify({ message: "No records available." }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ dates: uniqueDates }), {
      status: 200,
    });
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: "Error while receiving dates." }),
      { status: 500 }
    );
  }
}
