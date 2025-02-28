import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      console.error("Missing doctorId parameter");
      return new Response(
        JSON.stringify({ error: "Missing doctorId parameter" }),
        { status: 400 }
      );
    }

    const slots = await prisma.slot.findMany({
      where: {
        schedule: {
          doctorId: Number(doctorId), // Filter by doctorId, which is in the Schedule
        },
      },
      include: { schedule: true },
    });

    return new Response(JSON.stringify(slots), { status: 200 });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch slots" }), {
      status: 500,
    });
  }
}
