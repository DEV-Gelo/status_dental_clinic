import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { photoUrl } = await req.json();
    console.log("PhotoURL :", photoUrl);
    // Trim part of the URL to get only the path to the file in the bucket
    const fileOldPath = photoUrl
      .replace("blob:https://", "blob:https:/") // Remove the extra "/"
      .split("supabase.co/storage/v1/object/public/uploads")[1] // Extract the part after "uploads/"
      ?.replace(/^\/+/, ""); //Remove extra slashes at the beginning
    console.log("fileOldPathPlaceholder :", fileOldPath);
    // Delete previous file
    const { data, error } = await supabase.storage
      .from("uploads")
      .remove([fileOldPath]);

    if (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json(
        { message: "Failed to delete file" },
        { status: 500 }
      );
    }
    console.log("Success");
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
