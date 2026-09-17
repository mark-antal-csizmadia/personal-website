import type { NextConfig } from "next";
import path from "node:path";

const wsStub = path.join(__dirname, "src/lib/ml/ws-stub.cjs");
const nodeStub = path.join(__dirname, "src/lib/ml/node-stub.cjs");

const nextConfig: NextConfig = {
  transpilePackages: ["@wlearn/xgboost", "@wlearn/core"],
  turbopack: {
    resolveAlias: {
      ws: "./src/lib/ml/ws-stub.cjs",
      "node:fs": "./src/lib/ml/node-stub.cjs",
      "node:crypto": "./src/lib/ml/node-stub.cjs",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ws: wsStub,
      "node:fs": nodeStub,
      "node:crypto": nodeStub,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false,
      path: false,
      ws: false,
    };
    return config;
  },
};

export default nextConfig;
