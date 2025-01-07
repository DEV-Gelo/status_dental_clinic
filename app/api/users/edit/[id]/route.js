import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params; // Get the ID from the URL parameters

  if (!id) {
    return new Response("ID is required", { status: 400 });
  }

  try {
    // Get the user by ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (user) {
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      return new Response("User not found", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
