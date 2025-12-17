#!/usr/bin/env node

const { execSync } = require('child_process')
const prompts = require('prompts')
const path = require('path')
const chalk = require('chalk')

async function run() {
  console.log(
    chalk.cyan('\nWelcome to the Custom Themes Expo Starter Template!')
  )

  const questions = [
    {
      type: process.argv[2] ? null : 'text',
      name: 'projectName',
      message: 'What is the name of your project?',
      initial: 'my-themed-app',
      validate: (name) =>
        name.length > 0 ? true : 'Project name cannot be empty.',
    },
    {
      type: 'select',
      name: 'styleType',
      message: 'Choose your styling library:',
      choices: [
        {
          title: 'Standard (StyleSheet API)',
          value: 'standard',
          description: 'Default React Native styling',
        },
        {
          title: 'NativeWind (Tailwind CSS)',
          value: 'nativewind',
          description: 'Tailwind CSS utility classes',
        },
      ],
      initial: 0,
    },
  ]

  const response = await prompts(questions)

  const projectName = process.argv[2] || response.projectName
  const styleType = response.styleType

  if (!projectName || !styleType) {
    console.log(chalk.red('\nProject setup cancelled.'))
    return
  }

  const projectDir = path.resolve(projectName)

  const templates = {
    standard: 'https://github.com/KodeckJames/Expo-Themes-Starter-Kit',
    nativewind:
      'https://github.com/KodeckJames/Expo-Nativewind-Themes-Starter-Kit',
  }

  const templateRepoUrl = templates[styleType]

  console.log(
    chalk.blue(
      `\nSetting up ${chalk.bold(projectName)} using ${chalk.bold(
        styleType
      )}...`
    )
  )

  try {
    const installCommand = `npx create-expo-app@latest ${projectName} --template ${templateRepoUrl} --no-install`
    console.log(chalk.yellow(`\nRunning command: ${installCommand}`))
    execSync(installCommand, { stdio: 'inherit' })

    process.chdir(projectDir)
  } catch (error) {
    console.error(chalk.red(`\nFailed to clone template: ${error.message}`))
    process.exit(1)
  }

  try {
    console.log(
      chalk.blue(
        '\nRunning core dependency updates to latest Expo SDK version...'
      )
    )
    execSync(`npm install expo@^54.0.0`, { stdio: 'inherit' })
    execSync(`npx expo install --fix`, { stdio: 'inherit' })
    console.log(chalk.green('✅ Dependencies updated and fixed successfully!'))
  } catch (error) {
    console.error(
      chalk.red(`\nFailed to update dependencies: ${error.message}`)
    )
  }

  try {
    console.log(chalk.blue('\nInstalling project dependencies...'))
    execSync('npm install', { stdio: 'inherit' })
  } catch (error) {
    console.error(chalk.red(`\nFailed to run final install: ${error.message}`))
    process.exit(1)
  }

  try {
    console.log(
      chalk.magenta('\nFinalizing project setup with initial Git commit...')
    )
    execSync('git add .', { stdio: 'pipe' })
    execSync('git commit -m "Initial commit"', {
      stdio: 'pipe',
    })
    console.log(chalk.green('✅ Initial commit created!'))
  } catch (error) {
    console.error(
      chalk.yellow('\nCould not automatically create initial Git commit.')
    )
    console.error(
      chalk.yellow(
        'You may need to run git add . and git commit -m "Initial commit" manually!'
      )
    )
  }

  console.log(
    chalk.green(
      `\n\n🎉 Success! Your ${styleType} themed Expo project is ready in ${projectName}!`
    )
  )
  console.log(chalk.cyan(`\nNext steps:`))
  console.log(`- ${chalk.yellow(`cd ${projectName}`)}`)
  console.log(`- ${chalk.yellow('npx expo start')}`)
  console.log(chalk.grey('\nHappy coding!'))
}

run()
