import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // PWA manifest configuration relies on manifest.json 
  // service worker will auto-register.
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
