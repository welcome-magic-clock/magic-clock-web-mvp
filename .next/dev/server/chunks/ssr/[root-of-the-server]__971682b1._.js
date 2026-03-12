module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/features/meet/creators.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// features/meet/creators.ts
__turbopack_context__.s([
    "CREATORS",
    ()=>CREATORS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const CREATORS = [
    {
        id: 1,
        name: "Aiko Tanaka",
        handle: "@aiko_tanaka",
        city: "Lausanne (CH)",
        langs: [
            "FR",
            "EN",
            "JP"
        ],
        followers: 12400,
        specialties: [
            "Balayage",
            "Blond froid",
            "Soin"
        ],
        avatar: "/creators/aiko-tanaka.jpeg",
        access: [
            "FREE",
            "ABO",
            "PPV"
        ]
    },
    {
        id: 2,
        name: "Sofia Rivera",
        handle: "@sofia_rivera",
        city: "Madrid (ES)",
        langs: [
            "ES",
            "FR",
            "EN"
        ],
        followers: 9800,
        specialties: [
            "Balayage",
            "Soin"
        ],
        avatar: "/creators/sofia-rivera.jpeg",
        access: [
            "FREE",
            "PPV"
        ]
    },
    {
        id: 3,
        name: "Lena Martin",
        handle: "@lena_martin",
        city: "Lyon (FR)",
        langs: [
            "FR",
            "EN"
        ],
        followers: 18100,
        specialties: [
            "Blond froid",
            "Coupe"
        ],
        avatar: "/creators/lena-martin.jpeg",
        access: [
            "FREE",
            "ABO"
        ]
    },
    {
        id: 4,
        name: "Maya Flores",
        handle: "@maya_flores",
        city: "Zurich (CH)",
        langs: [
            "DE",
            "EN",
            "FR"
        ],
        followers: 7800,
        specialties: [
            "Coloriste & vidéo"
        ],
        avatar: "/creators/maya-flores.jpeg",
        access: [
            "FREE",
            "PPV"
        ]
    }
];
const __TURBOPACK__default__export__ = CREATORS;
}),
"[project]/components/LeftNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/LeftNav.tsx
__turbopack_context__.s([
    "default",
    ()=>LeftNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/meet/creators.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const items = [
    {
        href: "/",
        label: "Amazing",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/meet",
        label: "Meet me",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    {
        href: "/mymagic",
        label: "My Magic Clock",
        icon: null
    },
    {
        href: "/create",
        label: "Créer",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"]
    },
    {
        href: "/monet",
        label: "Monétisation",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"]
    },
    {
        href: "/messages",
        label: "Messages",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"]
    },
    {
        href: "/notifications",
        label: "Notifications",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
    },
    {
        href: "/legal",
        label: "Légal",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
    }
];
// Créateur courant pour l’avatar (comme sur My Magic Clock)
const currentCreator = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATORS"].find((c)=>c.name === "Aiko Tanaka") ?? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATORS"][0];
function LeftNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "hidden w-64 shrink-0 p-4 md:block",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "sticky top-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm font-semibold text-slate-700",
                    children: "Magic Clock — Menu"
                }, void 0, false, {
                    fileName: "[project]/components/LeftNav.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "space-y-1",
                    children: items.map(({ href, label, icon: Icon })=>{
                        const active = pathname === href || href !== "/" && pathname.startsWith(href + "/");
                        const isMyMagic = href === "/mymagic";
                        const isCreate = href === "/create";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: `flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition
                  ${active ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`,
                            children: [
                                isMyMagic ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative h-7 w-7 overflow-hidden rounded-full border bg-slate-100
                      ${active ? "border-indigo-500" : "border-slate-200"}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: currentCreator.avatar,
                                        alt: currentCreator.name,
                                        fill: true,
                                        className: "object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/LeftNav.tsx",
                                        lineNumber: 67,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/LeftNav.tsx",
                                    lineNumber: 63,
                                    columnNumber: 19
                                }, this) : Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: isCreate ? "h-5 w-5" : "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/LeftNav.tsx",
                                    lineNumber: 76,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/components/LeftNav.tsx",
                                    lineNumber: 82,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, href, true, {
                            fileName: "[project]/components/LeftNav.tsx",
                            lineNumber: 52,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/LeftNav.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/LeftNav.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/LeftNav.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/core/domain/magicClockWork.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// core/domain/magicClockWork.ts
__turbopack_context__.s([
    "ONBOARDING_MAGIC_CLOCK_FEED_CARD",
    ()=>ONBOARDING_MAGIC_CLOCK_FEED_CARD,
    "ONBOARDING_MAGIC_CLOCK_WORK",
    ()=>ONBOARDING_MAGIC_CLOCK_WORK,
    "magicClockWorkToFeedCard",
    ()=>magicClockWorkToFeedCard
]);
const ONBOARDING_MAGIC_CLOCK_WORK = {
    id: "mcw-onboarding-bear-001",
    slug: "magic-clock-onboarding",
    title: "Magic Clock te montre comment transformer ton expérience en lumière pour les autres",
    subtitle: "Tu as ce petit plus à partager. Avec Magic Clock, tu peux en faire un vrai soleil pour les autres.",
    creator: {
        id: "creator-magic-clock",
        name: "Magic Clock",
        handle: "@magic_clock_app",
        avatarUrl: "/images/magic-clock-bear/avatar.png",
        isCertified: true
    },
    access: {
        mode: "FREE",
        ppvPrice: null,
        isSystemFeatured: true,
        isSystemUnlockedForAll: true
    },
    studio: {
        before: {
            type: "image",
            url: "/images/magic-clock-bear/before.jpg",
            coverTime: null,
            thumbnailUrl: "/images/magic-clock-bear/before-thumb.jpg"
        },
        after: {
            type: "image",
            url: "/images/magic-clock-bear/after.jpg",
            coverTime: null,
            thumbnailUrl: "/images/magic-clock-bear/after-thumb.jpg"
        }
    },
    display: {
        cubeId: "cube-magic-clock-onboarding",
        faces: [
            {
                id: 1,
                label: "Face 1 — L’idée",
                description: "Magic Clock te montre comment transformer ton expérience en lumière pour les autres.",
                mediaUrl: "/images/magic-clock-bear/face-1.jpg"
            },
            {
                id: 2,
                label: "Face 2 — Studio",
                description: "Tu montres ton avant et ton après, comme sur TikTok ou Instagram, mais avec un sens pédagogique.",
                mediaUrl: "/images/magic-clock-bear/face-2.jpg"
            },
            {
                id: 3,
                label: "Face 3 — Display",
                description: "Tu découpes ton savoir en étapes dans le cube : diagnostic, préparation, application, etc.",
                mediaUrl: "/images/magic-clock-bear/face-3.jpg"
            },
            {
                id: 4,
                label: "Face 4 — Amazing",
                description: "Tes Magic ClockWorks apparaissent dans le flux, les gens les découvrent, like, sauvegardent, reviennent.",
                mediaUrl: "/images/magic-clock-bear/face-4.jpg"
            },
            {
                id: 5,
                label: "Face 5 — My Magic Clock & Monétisation",
                description: "Tu regroupes tes œuvres, tu choisis FREE / Abonnement / PPV, tu vois tes revenus grandir.",
                mediaUrl: "/images/magic-clock-bear/face-5.jpg"
            },
            {
                id: 6,
                label: "Face 6 — L’émotion",
                description: "Tu aides les autres à éviter des erreurs, à gagner du temps, à se sentir plus beaux, plus confiants. It’s time to smile!",
                mediaUrl: "/images/magic-clock-bear/face-6.jpg"
            }
        ],
        needles: [
            {
                id: "needle-mono-main",
                type: "mono",
                faceId: 1,
                segmentIndex: 0,
                length: 0.9,
                isExtended: true
            },
            {
                id: "needle-dual-link",
                type: "dual",
                faceId: 6,
                segmentIndex: 0,
                oppositeSegmentIndex: 3,
                length: 0.8,
                isExtended: true
            }
        ]
    },
    stats: {
        views: 0,
        likes: 0,
        saves: 0,
        shares: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
function magicClockWorkToFeedCard(work) {
    const access = work.access.mode === "PPV" ? "PPV" : work.access.mode === "SUB" ? "ABO" : "FREE";
    const image = work.studio.after?.thumbnailUrl ?? work.studio.after?.url ?? work.studio.before?.thumbnailUrl ?? work.studio.before?.url ?? "/images/examples/balayage-after.jpg";
    const beforeUrl = work.studio.before?.thumbnailUrl ?? work.studio.before?.url ?? null;
    const afterUrl = work.studio.after?.thumbnailUrl ?? work.studio.after?.url ?? null;
    return {
        id: work.id,
        title: work.title,
        image,
        beforeUrl,
        afterUrl,
        // on laisse le handle tel quel (avec @) → MediaCard le nettoie
        user: work.creator.handle,
        access,
        views: work.stats.views,
        // champs optionnels
        likes: work.stats.likes,
        creatorName: work.creator.name,
        creatorHandle: work.creator.handle,
        creatorAvatar: work.creator.avatarUrl,
        hashtags: [],
        isCertified: !!work.creator.isCertified,
        // 👇 NOUVEAU : flags système
        isSystemFeatured: !!work.access.isSystemFeatured,
        isSystemUnlockedForAll: !!work.access.isSystemUnlockedForAll
    };
}
const ONBOARDING_MAGIC_CLOCK_FEED_CARD = magicClockWorkToFeedCard(ONBOARDING_MAGIC_CLOCK_WORK);
}),
"[project]/features/amazing/feed.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// features/amazing/feed.ts
__turbopack_context__.s([
    "BASE_FEED",
    ()=>BASE_FEED,
    "FEED",
    ()=>FEED,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$domain$2f$magicClockWork$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/core/domain/magicClockWork.ts [app-ssr] (ecmascript)");
;
const BASE_FEED = [
    {
        id: 1,
        title: "Balayage caramel lumineux",
        user: "sofia_rivera",
        views: 12400,
        image: "/mp-1-after.jpg",
        access: "FREE",
        beforeUrl: "/mp-1-before.jpg",
        afterUrl: "/mp-1-after.jpg"
    },
    {
        id: 2,
        title: "Blond froid glossy",
        user: "aiko_tanaka",
        views: 18100,
        image: "/mp-2-after.jpg",
        access: "ABO",
        beforeUrl: "/mp-2-before.jpg",
        afterUrl: "/mp-2-after.jpg"
    },
    {
        id: 3,
        title: "Cuivré dimensionnel",
        user: "lena_martin",
        views: 9800,
        image: "/mp-3-after.jpg",
        access: "PPV",
        beforeUrl: "/mp-3-before.jpg",
        afterUrl: "/mp-3-after.jpg"
    },
    {
        id: 4,
        title: "Balayage soleil doux",
        user: "maya_flores",
        views: 7800,
        image: "/mp-4-after.jpg",
        access: "FREE",
        beforeUrl: "/mp-4-before.jpg",
        afterUrl: "/mp-4-after.jpg"
    }
];
const FEED = [
    __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$domain$2f$magicClockWork$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ONBOARDING_MAGIC_CLOCK_FEED_CARD"],
    ...BASE_FEED
];
const __TURBOPACK__default__export__ = FEED;
}),
"[project]/core/domain/repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// core/domain/repository.ts
// Repository "en mémoire" pour le MVP (sans Prisma / base de données)
__turbopack_context__.s([
    "findContentById",
    ()=>findContentById,
    "findCreatorByHandle",
    ()=>findCreatorByHandle,
    "listCreatedByCreator",
    ()=>listCreatedByCreator,
    "listCreators",
    ()=>listCreators,
    "listFeed",
    ()=>listFeed,
    "listFeedByCreator",
    ()=>listFeedByCreator,
    "listLibraryForViewer",
    ()=>listLibraryForViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/meet/creators.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$amazing$2f$feed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/amazing/feed.ts [app-ssr] (ecmascript)");
;
;
// 👇 tableau commun pour Amazing, My Magic Clock et Magic Display
// FEED contient déjà l’ours d’onboarding en premier
const ALL_FEED_CARDS = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$amazing$2f$feed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FEED"];
function listCreators() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATORS"];
}
function findCreatorByHandle(handle) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$meet$2f$creators$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CREATORS"].find((c)=>c.handle === handle);
}
function listFeed() {
    return ALL_FEED_CARDS;
}
function listFeedByCreator(handle) {
    return ALL_FEED_CARDS.filter((item)=>item.user === handle);
}
function listCreatedByCreator(handle) {
    return ALL_FEED_CARDS.filter((item)=>item.user === handle);
}
function listLibraryForViewer(viewerHandle) {
    return ALL_FEED_CARDS.slice(0, 4);
}
function findContentById(id) {
    const target = String(id);
    return ALL_FEED_CARDS.find((item)=>String(item.id) === target);
}
}),
"[project]/components/MobileTabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/MobileTabs.tsx
__turbopack_context__.s([
    "default",
    ()=>MobileTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$domain$2f$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/core/domain/repository.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const TABS = [
    {
        href: "/",
        label: "Amazing",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/meet",
        label: "Meet me",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
    },
    {
        href: "/create",
        label: "Créer",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"]
    },
    {
        href: "/monet",
        label: "Monétisation",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"]
    },
    {
        href: "/mymagic",
        label: "My Magic Clock",
        isProfile: true
    }
];
function MobileTabs() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    // On réutilise Aiko Tanaka comme créatrice actuelle
    const creators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$core$2f$domain$2f$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listCreators"])();
    const currentCreator = creators.find((c)=>c.name === "Aiko Tanaka") ?? creators[0];
    const avatar = currentCreator.avatar;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur md:hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-xl items-center justify-between gap-1",
            children: TABS.map((tab)=>{
                const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: tab.href,
                    className: `flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-1 text-[11px] ${isActive ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50"}`,
                    children: [
                        tab.isProfile ? // Avatar rond pour My Magic Clock
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mb-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: avatar,
                                alt: currentCreator.name,
                                className: "h-7 w-7 rounded-full object-cover"
                            }, void 0, false, {
                                fileName: "[project]/components/MobileTabs.tsx",
                                lineNumber: 77,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MobileTabs.tsx",
                            lineNumber: 76,
                            columnNumber: 17
                        }, this) : tab.href === "/create" && tab.icon ? // 🧊 Icône "Créer" bien mise en avant
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                                className: "h-5 w-5",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/MobileTabs.tsx",
                                lineNumber: 86,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MobileTabs.tsx",
                            lineNumber: 85,
                            columnNumber: 17
                        }, this) : tab.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                            className: "mb-0.5 h-5 w-5",
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/MobileTabs.tsx",
                            lineNumber: 90,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "leading-tight text-[10px] whitespace-nowrap",
                            children: tab.label
                        }, void 0, false, {
                            fileName: "[project]/components/MobileTabs.tsx",
                            lineNumber: 97,
                            columnNumber: 15
                        }, this)
                    ]
                }, tab.href, true, {
                    fileName: "[project]/components/MobileTabs.tsx",
                    lineNumber: 65,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/MobileTabs.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MobileTabs.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/legal/CookieBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/legal/CookieBanner.tsx
__turbopack_context__.s([
    "CookieBanner",
    ()=>CookieBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const STORAGE_KEY = "mc-cookie-consent-v1";
function CookieBanner() {
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
    }, []);
    const handleChoice = (value)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        setVisible(false);
    };
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-4xl items-start gap-3 px-4 py-3 text-xs sm:text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-1 text-slate-700",
                    children: "Nous utilisons des cookies nécessaires au fonctionnement de Magic Clock et, avec ton accord, des cookies de mesure d’audience pour améliorer l’expérience. Tu peux modifier ton choix plus tard dans les paramètres."
                }, void 0, false, {
                    fileName: "[project]/components/legal/CookieBanner.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-shrink-0 gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleChoice("reject"),
                            className: "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50",
                            children: "Refuser"
                        }, void 0, false, {
                            fileName: "[project]/components/legal/CookieBanner.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleChoice("accept"),
                            className: "inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700",
                            children: "Accepter"
                        }, void 0, false, {
                            fileName: "[project]/components/legal/CookieBanner.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/legal/CookieBanner.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/legal/CookieBanner.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/legal/CookieBanner.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__971682b1._.js.map