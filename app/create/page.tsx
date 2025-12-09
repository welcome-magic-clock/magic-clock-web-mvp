// app/create/page.tsx
import { redirect } from "next/navigation";

export default function CreatePage() {
  // Dès qu'on arrive sur /create, on bascule sur /studio
  redirect("/studio");
}
