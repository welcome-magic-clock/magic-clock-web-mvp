// app/display/page.tsx
// Page index /display → redirige vers Amazing
import { redirect } from "next/navigation";

export default function DisplayIndexPage() {
  redirect("/");
}
