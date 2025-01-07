import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Отримання всіх дат із розкладом та слотами
    const schedules = await prisma.schedule.findMany({
      where: {
        slots: {
          some: {
            isBooked: false, // Тільки доступні слоти
          },
        },
      },
      select: {
        date: true, // Тільки поле дати
      },
    });

    // Формуємо унікальний список дат
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
        JSON.stringify({ message: "Немає доступних записів." }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ dates: uniqueDates }), {
      status: 200,
    });
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: "Помилка при отриманні дат." }),
      { status: 500 }
    );
  }
}
