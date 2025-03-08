"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("ahmetturanozturk@yandex.com");
  const [password, setPassword] = useState("P@ssw0rd");
  const { login } = useStore();
  const router = useRouter();



  return (
    <div className="flex items-center justify-center hd-screen bg-grday-50">
     Login
    </div>
  );
}
