
import { execSync } from "child_process";
import prompts from "prompts";
import chalk from "chalk";
import fs from "fs";
import degit from "degit";

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
    const emitter = degit("Team-Supervaisor/frontend-next-starter", {
      cache: false,
      force: true,
      verbose: true,
    });
    await emitter.clone(projectName);

    console.log(chalk.green("\n✅ Template copied successfully."));
  } catch (error) {
    console.error(chalk.red("\n❌ Failed to copy the repository."));
    console.error(error.message);
    process.exit(1);
  }


  process.chdir(projectName);

  if (fs.existsSync(".git")) {
    fs.rmSync(".git", { recursive: true, force: true });
  }


  try {
    execSync("git init", { stdio: "inherit" });
    execSync("git add .", { stdio: "inherit" });
    execSync('git commit -m "Initial commit from create-next-starter"', {
      stdio: "inherit",
    });
    console.log(chalk.green("\n✅ Initialized new Git repository."));
  } catch (error) {
    console.warn(chalk.yellow("\n⚠️ Skipped git initialization."));
  }


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
      console.error(
        chalk.red(`\n❌ Failed to install dependencies with ${packageManager}.`)
      );
      console.error(error.message);
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
