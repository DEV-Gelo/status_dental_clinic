"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export default function ClientLayout({ children }) {
  const [messages, setMessages] = useState({});
  const locale = useLocale();

  useEffect(() => {
    import(`@/locales/${locale}.json`).then((data) => {
      setMessages(data);
    });
  }, [locale]);

  return <div>{messages && children}</div>;
}
