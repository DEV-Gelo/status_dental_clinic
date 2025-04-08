import { useEffect, useState } from "react";
import Image from "next/image";

export default function AccessPhoto({ fileKey }) {
  const [signedUrl, setSignedUrl] = useState(null);

  const isPlaceholder = fileKey === "/image-placeholder.svg";
  const imageSrc = isPlaceholder ? fileKey : signedUrl;

  useEffect(() => {
    async function fetchSignedUrl() {
      if (isPlaceholder || !fileKey) return;

      const baseUrl = "https://s3.us-east-1.wasabisys.com/dentapro";
      let cleanedKey = fileKey.startsWith(baseUrl)
        ? fileKey.slice(baseUrl.length)
        : fileKey;
      try {
        const res = await fetch(`/api/upload/get-signed-url?key=${cleanedKey}`);
        const data = await res.json();

        if (res.ok) {
          setSignedUrl(data.url);
        } else {
          console.error("Signed URL fetch error", data);
        }
      } catch (err) {
        console.error("Signed URL fetch exception", err);
      }
    }

    fetchSignedUrl();
  }, [fileKey, isPlaceholder]);

  return (
    <Image
      src={imageSrc || "/image-placeholder.svg"}
      alt="User photo"
      width={50}
      height={50}
      className="rounded-full object-cover"
    />
  );
}
