# 🛍️ Shopify Theme Setup

A simple CLI tool to standardize Shopify theme development across projects.

## Features

- Automatic setup of code formatting with Prettier
- Pre-commit hooks with Husky and lint-staged
- VS Code configuration for Shopify theme development
- Consistent configuration across all projects

## Installation

```bash
# Navigate to your project directory 
cd your-shopify-theme

# Configure npm registry settings
echo "@digismoothie-agency:registry=https://npm.pkg.github.com" >> .npmrc
echo "registry=https://registry.npmjs.org/" >> .npmrc

# Run with npx
npx @digismoothie-agency/shopify-theme-setup
```

## What It Does 🚀

This tool automatically:

1. Sets up Prettier for code formatting
2. Configures Husky pre-commit hooks with lint-staged
3. Creates VS Code settings and extension recommendations
4. Establishes a consistent project structure

## Configuration Files Created

- `.prettierrc.json` - Configuration for Prettier
- `.vscode/settings.json` - VS Code settings
- `.vscode/extensions.json` - Recommended VS Code extensions
- `.gitignore` - Standard Git ignore settings
- `.shopifyignore` - Shopify-specific ignore settings
- `.lintstagedrc` - Configuration for lint-staged
- Husky pre-commit hooks

## Requirements

- Node.js 14+
- Git

## Recommended Workflow

After running this setup:

1. Install the recommended VS Code extensions
2. Commit code with pre-commit hooks automatically formatting your code
3. Enjoy consistent formatting across all team members' contributions

## Contributing 🤝

Feel free to suggest improvements! Create a branch with your changes, submit a PR, or start a discussion in our team channels. Our standards should evolve together with our projects.

## License

MIT