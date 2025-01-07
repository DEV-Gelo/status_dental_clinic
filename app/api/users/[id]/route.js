import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params; // Get ID from params URL

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
    });
  }
}
