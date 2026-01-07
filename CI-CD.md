# CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

The pipeline runs on:

- **Push** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop`
- **Release** creation

#### Jobs

1. **Install Dependencies**
   - Caches `node_modules` for faster subsequent jobs
   - Uses Node.js 20

2. **Lint & Type Check**
   - Runs TypeScript type checking with `vue-tsc`
   - Ensures code quality and type safety

3. **Build Package**
   - Builds the library using Vite
   - Uploads build artifacts for verification
   - Artifacts are retained for 7 days

4. **Publish to NPM** (Release only)
   - Automatically publishes to NPM when a GitHub release is created
   - Requires `NPM_TOKEN` secret to be configured

5. **Upload Release Assets** (Release only)
   - Creates a tarball of the package
   - Uploads it to the GitHub release

## Setup Instructions

### Required Secrets

To enable NPM publishing, add the following secret to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your NPM access token (create one at [npmjs.com/settings](https://www.npmjs.com/settings/YOUR_USERNAME/tokens))

### Creating a Release

To publish a new version:

1. Update the version in `package.json`:

   ```bash
   npm version patch  # or minor, or major
   ```

2. Push the changes and tags:

   ```bash
   git push && git push --tags
   ```

3. Create a GitHub release:
   - Go to **Releases** → **Draft a new release**
   - Choose the tag you just created
   - Add release notes
   - Click **Publish release**

The CI/CD pipeline will automatically:

- Run all tests and checks
- Build the package
- Publish to NPM
- Upload the tarball to the release

## Local Development

Run these commands locally before pushing:

```bash
# Type check
npm run typecheck

# Build
npm run build

# Preview build
npm run preview
```

## Branch Protection

It's recommended to set up branch protection rules for `main`:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select status checks: `Lint & Type Check`, `Build Package`
   - ✅ Require pull request reviews before merging

This ensures all code is reviewed and passes CI before merging.
