"use client";

import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("./provider"), { ssr: false });

export default ThemeProvider;
