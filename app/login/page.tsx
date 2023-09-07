"use client";

import LoginForm from "@/shared/components/form/login-form";
import ClvLogo from "@/shared/components/logo/clvlogo";
import React from "react";

export default function DashboardHome() {
  return (
    <div style={{ justifyContent: "center" }}>
      <ClvLogo></ClvLogo>
      <LoginForm></LoginForm>
    </div>
  );
}
