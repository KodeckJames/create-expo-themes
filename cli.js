#!/usr/bin/env node

const { execSync } = require('child_process');
const prompts = require('prompts');
const path = require('path');
const chalk = require('chalk');

async function run() {
    let projectName = process.argv[2];

    if (!projectName) {
        console.log(chalk.cyan('\nWelcome to the Custom Themes Expo Starter Template!'));
        const response = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'What is the name of your project?',
            initial: 'my-themed-app',
            validate: name => name.length > 0 ? true : 'Project name cannot be empty.'
        });
        projectName = response.projectName;
    }

    if (!projectName) {
        console.log(chalk.red('Project setup cancelled.'));
        return;
    }

    const projectDir = path.resolve(projectName);
    const templateRepoUrl = 'https://github.com/KodeckJames/Expo-Themes-Starter-Kit';

    console.log(chalk.blue(`\nSetting up ${chalk.bold(projectName)} with your custom theme template...`));

    try {
        const installCommand = `npx create-expo-app@latest ${projectName} --template ${templateRepoUrl} --no-install`;
        console.log(chalk.yellow(`\nRunning command: ${installCommand}`));
        execSync(installCommand, { stdio: 'inherit' });
        
        process.chdir(projectDir);
    } catch (error) {
        console.error(chalk.red(`\nFailed to clone template: ${error.message}`));
        process.exit(1);
    }

    try {
        console.log(chalk.blue('\nRunning core dependency updates to latest SDK...'));
        
        execSync(`npm install expo@latest`, { stdio: 'inherit' });

        execSync(`npx expo install --fix`, { stdio: 'inherit' });

        console.log(chalk.green('✅ Dependencies updated and fixed successfully!'));
    } catch (error) {
        console.error(chalk.red(`\nFailed to update dependencies: ${error.message}`));
    }

    try {
        console.log(chalk.blue('\nInstalling final dependencies...'));
        execSync('npm install', { stdio: 'inherit' });
    } catch (error) {
        console.error(chalk.red(`\nFailed to run final install: ${error.message}`));
        process.exit(1);
    }

    console.log(chalk.green(`\n\n🎉 Success! Your custom themed Expo project is ready in ${projectName}!`));
    console.log(chalk.cyan(`\nNext steps:`));
    console.log(`- ${chalk.yellow(`cd ${projectName}`)}`);
    console.log(`- ${chalk.yellow('npm start')} or ${chalk.yellow('npx expo start')}`);
    console.log(chalk.grey('\nHappy coding!'));
}

run();