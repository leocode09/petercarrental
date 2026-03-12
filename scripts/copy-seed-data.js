#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "src", "data");
const dest = join(root, "functions", "src", "_data");

if (!existsSync(src)) {
  console.warn("Source data not found:", src);
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copied seed data to functions/src/_data");
