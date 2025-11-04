#!/usr/bin/env node
import { execSync } from "child_process";
import prompts from "prompts";
import chalk from "chalk";
import fs from "fs";

async function main() {
  console.log(chalk.cyan("🚀 Create My Next App"));

  const args = process.argv.slice(2);
  let projectName = args[0];

  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "What is your project name?",
      initial: "my-next-app",
    });
    projectName = response.projectName;
  }

  if (!projectName) {
    console.log(chalk.red("❌ Project name is required!"));
    process.exit(1);
  }

  console.log(chalk.yellow(`\n📦 Creating project ${projectName}...`));


  try {
    execSync(
      `git clone https://github.com/Team-Supervaisor/frontend-next-starter.git ${projectName}`,
      { stdio: "inherit" }
    );
    console.log(chalk.green("\n✅ Template cloned successfully."));
  } catch (error) {
    console.error(chalk.red("\n❌ Failed to clone the repository."));
    console.error(error.message);
    process.exit(1);
  }


  process.chdir(projectName);

  const { packageManager } = await prompts({
    type: "select",
    name: "packageManager",
    message: "Which package manager would you like to use?",
    choices: [
      { title: "npm", value: "npm" },
      { title: "pnpm", value: "pnpm" },
      { title: "yarn", value: "yarn" },
      { title: "skip install", value: "skip" },
    ],
    initial: 0,
  });

  if (packageManager !== "skip") {
    console.log(
      chalk.yellow(`\n📦 Installing dependencies using ${packageManager}...`)
    );
    try {
      execSync(`${packageManager} install`, { stdio: "inherit" });
      console.log(
        chalk.green(
          `\n✅ Dependencies installed successfully using ${packageManager}.`
        )
      );
    } catch (error) {
      console.error(chalk.red("\n❌ Failed to clone the repository."));
      console.error(error.message);
      process.exit(1);
    }

  } else {
    console.log(chalk.gray("\n⚙️ Skipped dependency installation."));
  }

  console.log(chalk.green(`\n🎉 Project setup complete!`));
  console.log(chalk.blue(`\nNext steps:`));
  console.log(`  cd ${projectName}`);
  if (packageManager !== "skip") {
    console.log(`  ${packageManager} run dev`);
  } else {
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  }
}

main();
