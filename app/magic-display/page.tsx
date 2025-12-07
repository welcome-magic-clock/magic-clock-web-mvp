import { Suspense } from "react";
import MagicDisplayClient from "./MagicDisplayClient";

export default function MagicDisplayPage() {
  return (
    <Suspense fallback={null}>
      <MagicDisplayClient />
    </Suspense>
  );
}
