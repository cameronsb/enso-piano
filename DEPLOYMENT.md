# Deployment Instructions for Circular Piano

This app is configured for deployment to GitHub Pages. Follow these steps to deploy:

## Prerequisites
- GitHub repository created for this project
- Git remote origin set up

## Setup Steps

### 1. Create GitHub Repository
Repository already created at: https://github.com/cameronsb/enso-piano

To add it as origin:
```bash
git remote add origin https://github.com/cameronsb/enso-piano.git
```

### 2. Base URL Configuration
✅ Already configured in `vite.config.ts` with `/enso-piano/`

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Build and deployment", select "GitHub Actions" as the source

### 4. Deploy

#### Option A: Automatic Deployment (Recommended)
Simply push to the main branch:
```bash
git add .
git commit -m "Initial deployment setup"
git push -u origin main
```
The GitHub Actions workflow will automatically build and deploy your app.

#### Option B: Manual Deployment
Run the deploy script:
```bash
npm run deploy
```
This will build the app and push to the `gh-pages` branch.

### 5. Access Your App
After deployment, your app will be available at:
```
https://cameronsb.github.io/enso-piano/
```

## Continuous Deployment
Any push to the `main` branch will automatically trigger a new deployment through GitHub Actions.

## Troubleshooting

### If the site doesn't load:
1. Check that GitHub Pages is enabled in repository settings
2. Verify the base URL in `vite.config.ts` matches your repository name
3. Wait a few minutes for GitHub Pages to propagate changes
4. Check the Actions tab in your repository for build errors

### If assets don't load correctly:
- Ensure the `base` path in `vite.config.ts` matches your repository name exactly
- The repository name is case-sensitive