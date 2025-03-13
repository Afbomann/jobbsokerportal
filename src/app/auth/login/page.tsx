import { Metadata } from "next";
import LoginClient from "./loginClient";

export const metadata: Metadata = {
  title: "Login",
};

export default function AuthLoginPage() {
  return <LoginClient />;
}
