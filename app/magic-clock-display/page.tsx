// app/magic-clock-display/page.tsx
import type { Metadata } from "next";
import MagicClockDisplayClient from "./MagicClockDisplayClient";

export const metadata: Metadata = {
  title: "Magic Display",
};

export default function MagicClockDisplayPage() {
  return <MagicClockDisplayClient />;
}
