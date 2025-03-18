import prisma from "@/lib/prisma";

export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const {
    lastName,
    firstName,
    patronymic,
    role,
    specialization,
    phone,
    email,
    photo,
  } = data;

  // Checking and assigning null to the photo if it doesn't exist
  const photoUrl = photo ? photo : null;

  try {
    // Checking the presence of an email or phone number in the database
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return new Response(
          JSON.stringify({ message: "This email already exists" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      if (existingUser.phone === phone) {
        return new Response(
          JSON.stringify({ message: "This phone number already exists" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        patronymic,
        role,
        specialization,
        phone,
        email,
        photo: photoUrl,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Surrogate-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Error creating user", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
