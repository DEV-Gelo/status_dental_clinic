import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json(); // використовуємо JSON замість formData для простоти

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

    // Якщо немає фото, присвоюємо null
    const photoUrl = photo || null;

    // Перевіряємо наявність користувача з таким email або номером телефону
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

    // Створюємо нового користувача
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
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ message: "Error creating user", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect();
  }
}
