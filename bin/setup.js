#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');

// Target directory is the current working directory
const targetDir = process.cwd();

// Package version
const pkg = require('../package.json');
console.log(chalk.blue(`🚀 Shopify Theme Setup v${pkg.version}`));
console.log(chalk.blue('Setting up your Shopify theme development environment...\n'));

// Function to run shell commands with better error handling
function runCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit', cwd: targetDir });
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ ${errorMessage || `Failed to execute: ${command}`}`));
    console.error(chalk.gray(error.message));
    return false;
  }
}

// Function to prompt user for input
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function setup() {
  // Check Node.js version
  const nodeVersion = process.versions.node;
  const [major] = nodeVersion.split('.');
  if (Number(major) < 14) {
    console.error(chalk.red('❌ Node.js version 14 or higher is required.'));
    process.exit(1);
  }

  // Check if package.json exists, if not create it
  if (!fs.existsSync(path.join(targetDir, 'package.json'))) {
    console.log(chalk.blue('📦 Creating package.json...'));
    if (!runCommand('npm init -y', 'Failed to create package.json')) {
      process.exit(1);
    }
  }

  // Remove test script from package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  delete packageJson.scripts.test;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Initialize Git if not already a repository
  if (!fs.existsSync(path.join(targetDir, '.git'))) {
    console.log(chalk.blue('🔧 Initializing Git repository...'));
    if (!runCommand('git init', 'Failed to initialize Git repository')) {
      process.exit(1);
    }
  }

  // Check for existing configurations
  let configFiles = [
    '.prettierrc.json',
    '.gitignore',
    '.shopifyignore',
    '.vscode/extensions.json',
    '.vscode/settings.json',
    '.lintstagedrc'
  ];

  const existingFiles = configFiles.filter(file => 
    fs.existsSync(path.join(targetDir, file))
  );

  if (existingFiles.length > 0) {
    console.log(chalk.yellow('⚠️  The following configuration files already exist:'));
    existingFiles.forEach(file => console.log(chalk.yellow(`   - ${file}`)));
    
    const shouldOverwrite = await promptUser('\nDo you want to overwrite these files? (y/N) ');
    if (!shouldOverwrite) {
      console.log(chalk.blue('\nSkipping existing files. Setup will continue with remaining configurations.'));
      // Remove existing files from the list to copy
      configFiles = configFiles.filter(file => !existingFiles.includes(file));
    }
  }

  // Install required dependencies
  console.log(chalk.blue('\n📚 Installing dependencies...'));
  if (!runCommand('npm install --save-dev prettier husky lint-staged', 'Failed to install dependencies')) {
    process.exit(1);
  }

  // Copy configuration files
  console.log(chalk.blue('📄 Creating configuration files...'));
  try {
    // Create .vscode directory if it doesn't exist
    fs.ensureDirSync(path.join(targetDir, '.vscode'));

    // Copy each configuration file
    for (const file of configFiles) {
      const sourcePath = path.join(
        __dirname, 
        '..', 
        'templates', 
        file
          .replace('.prettierrc.json', 'prettierrc.json')
          .replace('.gitignore', 'gitignore')
          .replace('.shopifyignore', 'shopifyignore')
          .replace('.vscode/', 'vscode/')
          .replace('.lintstagedrc', 'lintstagedrc')
      );
      const targetPath = path.join(targetDir, file);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(chalk.green(`✓ Created ${file}`));
    }
  } catch (error) {
    console.error(chalk.red('❌ Failed to copy configuration files'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  // Initialize Husky
  console.log(chalk.blue('\n🐶 Setting up Husky for pre-commit hooks...'));
  if (!runCommand('npx husky-init', 'Failed to initialize Husky')) {
    process.exit(1);
  }

  // Copy our pre-commit hook
  const preCommitSource = path.join(__dirname, '..', 'templates', 'husky', 'pre-commit');
  const preCommitTarget = path.join(targetDir, '.husky', 'pre-commit');
  fs.copyFileSync(preCommitSource, preCommitTarget);
  fs.chmodSync(preCommitTarget, '755');

  // Configure lint-staged
  console.log(chalk.blue('🔍 Configuring lint-staged...'));
  
  // First, ensure lint-staged is properly installed
  if (!runCommand('npm install --save-dev lint-staged', 'Failed to install lint-staged')) {
    process.exit(1);
  }

  // Verify lint-staged is properly configured
  if (!fs.existsSync(path.join(targetDir, 'node_modules', 'lint-staged'))) {
    console.error(chalk.red('❌ lint-staged installation failed'));
    process.exit(1);
  }

  console.log(chalk.green('\n✅ Setup complete! Your Shopify theme development environment is ready.'));
  console.log(chalk.blue('\nNext steps:'));
  console.log(chalk.gray('1. Start developing your theme'));
  console.log(chalk.gray('2. Your code will be automatically formatted on commit'));
  console.log(chalk.gray('3. VS Code will use the recommended settings and extensions\n'));
}

// Run the setup
setup().catch(error => {
  console.error(chalk.red('❌ An error occurred during setup:'));
  console.error(chalk.red(error.message));
  process.exit(1);
});