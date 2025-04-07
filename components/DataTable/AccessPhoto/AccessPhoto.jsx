import { useEffect, useState } from "react";
import Image from "next/image";

export default function AccessPhoto({ fileKey }) {
  const [signedUrl, setSignedUrl] = useState(null);
  const [error, setError] = useState(false); // ОГОЛОШЕННЯ error тут ✅

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!fileKey) {
        setError(true);
        return;
      }

      const baseUrl = "https://s3.us-east-1.wasabisys.com/dentapro";
      let cleanedKey = fileKey.startsWith(baseUrl)
        ? fileKey.slice(baseUrl.length)
        : fileKey;

      try {
        const res = await fetch(`/api/upload/get-signed-url?key=${cleanedKey}`);
        const data = await res.json();

        if (res.ok) {
          setSignedUrl(data.url);
          setError(false); // Скидаємо помилку, якщо все добре
        } else {
          setError(true);
          console.error("Signed URL fetch error", data);
        }
      } catch (err) {
        setError(true);
        console.error("Signed URL fetch exception", err);
      }
    }

    fetchSignedUrl();
  }, [fileKey]);

  const imageSrc = error || !signedUrl ? "/image-placeholder.svg" : signedUrl;

  return (
    <Image
      src={imageSrc}
      alt="User photo"
      width={50}
      height={50}
      className="rounded-full object-cover"
    />
  );
}
