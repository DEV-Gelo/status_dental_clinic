import prisma from "@/lib/prisma";

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const { lastName, firstName, patronymic, role, phone, email, photo } = data;

  // Checking and assigning null to the photo if it doesn't exist
  const photoUrl = photo ? photo : null;

  try {
    const user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        patronymic,
        role,
        phone,
        email,
        photo: photoUrl,
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return new Response("Email already exists", { status: 400 });
    }

    return new Response("Error creating user", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
