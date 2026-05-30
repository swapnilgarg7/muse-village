"use client";

import { Suspense } from "react";
import MessagesPage from "~/components/MessagesPage";
import Loading from "@/components/loader/Loading";

export default function Messages() {
  return (
    <Suspense fallback={<Loading />}>
      <MessagesPage />
    </Suspense>
  );
}
