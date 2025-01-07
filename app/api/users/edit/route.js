import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());
    const { id, firstName, lastName, patronymic, phone, email, role, photo } =
      data;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        patronymic,
        phone,
        email,
        role,
        photo,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}
