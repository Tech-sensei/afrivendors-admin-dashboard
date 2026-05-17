import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/");

  // This return statement is a fallback and won't be reached
  return null;
}
