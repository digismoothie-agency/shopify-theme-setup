
#  Shopify Theme - [Theme Name]

## Overview
This repository contains the source code of Shopify theme **[Theme Name]** with customizations developed for for **[Client Name]**. 


## Store info
- **Shopify URL**: **[https://client-store.myshopify.com]**


## Tech Stack
- **[Shopify CLI](https://shopify.dev/docs/api/shopify-cli)** for development and deployment
- **Liquid**
- **JavaScript**
- **CSS**
- **Dev tooling**: Prettier, Husky, VS code settings and more – set up using [Shopify theme setup](https://github.com/digismoothie-agency/shopify-theme-setup)


## Getting Started

### Prerequisites
- A Shopify Partner or Staff account
- Shopify CLI (`npm install -g @shopify/cli`)

### Common Shopify CLI Commands
```bash
shopify theme dev               # Start local dev server
theme-check                     # Run theme linter
```

## Dev guidelines
- Follow the guidelines in [Guideline - Dev workflows](https://github.com/digismoothie-agency/.github-private/tree/main/guidelines/dev-workflows)


## Deployment

### Main branch is connected to client's Shopify store as live theme
1. Commit your changes to a **feature branch**, e.g. `feature/[JIRA-TASK-ID]`
2. Create a Pull Request targeting the main branch
3. Once approved and merged into main, your changes will be automatically deployed