import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const root = join(import.meta.dirname, "..");
const envPath = join(root, ".env");
const envContent = readFileSync(envPath, "utf-8");
const token = envContent.match(/GITHUB_TOKEN=(.+)/)?.[1]?.trim();

if (!token) {
  console.error("Error: GITHUB_TOKEN not found in .env file");
  process.exit(1);
}

const repo = `https://${token}@github.com/LYH-creative/LYH-Blogs.git`;
const distDir = join(root, "dist");

function run(cmd, cwd) {
  console.log(`\n> ${cmd}`);
  try {
    const out = execSync(cmd, { cwd, encoding: "utf-8" });
    if (out.trim()) console.log(out.trim());
  } catch (e) {
    console.error("STDERR:", e.stderr || e.message);
    throw e;
  }
}

run("git init", distDir);
run("git checkout -B gh-pages", distDir);

try { run("git remote remove origin", distDir); } catch {}

run(`git remote add origin ${repo}`, distDir);
run("git add -A", distDir);
run('git commit -m "deploy: [skip ci]"', distDir);

// 尝试 push，带详细错误
console.log("\n> git push -f origin gh-pages");
try {
  const out = execSync("git push -f origin gh-pages", {
    cwd: distDir,
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(out.trim());
} catch (e) {
  const stderr = e.stderr || "";
  console.error("Git Push Failed:");
  console.error(stderr);

  // 如果失败了，打印 git remote -v 帮助调试
  console.log("\n--- Debug Info ---");
  try {
    console.log(execSync("git remote -v", { cwd: distDir, encoding: "utf-8" }).trim());
  } catch {}
  console.log("-----------------\n");

  if (stderr.includes("Connection was reset") || stderr.includes("Recv failure")) {
    console.log("Hint: Network issue. Try using a proxy or VPN.");
  }
  if (stderr.includes("403") || stderr.includes("Authentication") || stderr.includes("access rights")) {
    console.log("Hint: Token may be invalid or expired. Generate a new one at https://github.com/settings/tokens");
    console.log("Make sure the token has 'repo' scope checked.");
  }

  process.exit(1);
}

console.log("\nDeploy successful!");
