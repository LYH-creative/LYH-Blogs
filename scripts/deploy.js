import { join } from "node:path";
import { execSync } from "node:child_process";

const root = join(import.meta.dirname, "..");
const distDir = join(root, "dist");

// 推送地址改用 SSH，不再依赖会过期的 Personal Access Token。
// 前提：本机已生成 SSH 密钥、并把公钥添加到 GitHub 账号。
// 自检命令：ssh -T git@github.com  （返回 "Hi xxx! You've successfully authenticated" 即正常）
const repo = "git@github.com:LYH-creative/LYH-Blogs.git";

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

// 复用主仓库里已配置好的提交身份，避免 dist 的临时仓库因缺少身份而提交失败
function readGitConfig(key, fallback) {
  try {
    return execSync(`git config ${key}`, { cwd: root, encoding: "utf-8" }).trim() || fallback;
  } catch {
    return fallback;
  }
}

const userName = readGitConfig("user.name", "LYH-creative");
const userEmail = readGitConfig("user.email", "2045774875@qq.com");

run("git init", distDir);
run("git checkout -B gh-pages", distDir);

try {
  run("git remote remove origin", distDir);
} catch {}

run(`git remote add origin ${repo}`, distDir);
run(`git config user.name "${userName}"`, distDir);
run(`git config user.email "${userEmail}"`, distDir);
run("git add -A", distDir);
run('git commit -m "deploy: [skip ci]"', distDir);

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

  console.log("\n--- Debug Info ---");
  try {
    console.log(execSync("git remote -v", { cwd: distDir, encoding: "utf-8" }).trim());
  } catch {}
  console.log("-----------------\n");

  if (stderr.includes("Connection was reset") || stderr.includes("Recv failure")) {
    console.log("Hint: Network issue. Try using a proxy or VPN.");
  }
  if (
    stderr.includes("Permission denied") ||
    stderr.includes("publickey") ||
    stderr.includes("Authentication failed")
  ) {
    console.log("Hint: SSH key not configured or not added to GitHub.");
    console.log("Run: ssh -T git@github.com  to check.");
    console.log("If it fails, add your public key at https://github.com/settings/keys");
  }

  process.exit(1);
}

console.log("\nDeploy successful!");
