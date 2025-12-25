// app/mymagic/MyMagicClient.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import MyMagicToolbar from "@/components/mymagic/MyMagicToolbar";
import MediaCard from "@/features/amazing/MediaCard";
import { listFeed, listCreators } from "@/core/domain/repository";
import Cockpit from "@/features/monet/Cockpit";
import {
  STUDIO_FORWARD_KEY,
  type StudioForwardPayload,
} from "@/core/domain/magicStudioBridge";
import { Heart, Lock, Unlock, ArrowUpRight } from "lucide-react";
import type { FeedCard } from "@/core/domain/types";

// ... puis tout le reste inchangé ...

export default function MyMagicClient() {
  // ... ton code actuel ...
}
