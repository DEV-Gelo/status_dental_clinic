import prisma from "@/lib/prisma"; // Connecting to prisma to work with the database
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req) {
  try {
    // Receive data from the request
    const body = await req.json();
    const {
      firstName,
      lastName,
      patronymic,
      phone,
      email,
      service,
      time,
      date,
      scheduleId,
      doctorId,
      slotId,
    } = body;

    // Validation data
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !date ||
      !time ||
      !doctorId ||
      !scheduleId ||
      !slotId
    ) {
      return new Response(JSON.stringify({ error: "Fill in all fields" }), {
        status: 400,
      });
    }

    // Check for slot availability
    const existingSlot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (existingSlot.isBooked) {
      return new Response(
        JSON.stringify({
          error: "This slot is already taken. Refresh the page.",
        }),
        { status: 400 }
      );
    }

    // Find existing user by email
    let existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If no user found by email, search by phone
    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { phone },
      });
    }

    // If user is found, update the phone if needed
    if (existingUser) {
      // Update user if phone is different
      if (existingUser.phone !== phone) {
        existingUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            phone, // Update phone number
          },
        });
      }
    } else {
      // If no user exists, create a new one
      existingUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          patronymic: patronymic || "",
          phone,
          email,
          role: "patient",
          photo: "/image-placeholder.svg",
        },
      });
    }

    // Create an appointment record
    const appointmentData = {
      firstName,
      lastName,
      patronymic: patronymic || "",
      phone,
      email,
      service,
      date: new Date(date),
      time,
      slotId,
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      schedule: {
        connect: {
          id: scheduleId,
        },
      },
      user: {
        connect: {
          id: existingUser.id, // Link the appointment to the existing or newly created user
        },
      },
    };

    // Using transaction for atomicity of operations
    const [newAppointment, _] = await prisma.$transaction([
      prisma.appointment.create({
        data: appointmentData,
      }),
      prisma.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      }),
    ]);

    // Formatting date for Telegram message
    const formattedDate = new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Forming telegram message
    const message = `
<b>🔔 Новий запис на прийом!</b>
<b>Пацієнт:</b> ${lastName} ${firstName} ${patronymic || ""}
<b>📞 Телефон:</b> ${phone}
<b>📧 Email:</b> ${email}
<b>📅 Дата:</b> ${formattedDate}
<b>🕒 Час:</b> ${time}
`;

    // Send message to Telegram
    await sendTelegramMessage(message);

    return new Response(
      JSON.stringify({
        message: "Record and user successfully created or updated!",
        appointment: newAppointment,
        user: existingUser,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating record:", error.message);
    return new Response(
      JSON.stringify({ error: "An error occurred while creating the record" }),
      { status: 500 }
    );
  }
}
