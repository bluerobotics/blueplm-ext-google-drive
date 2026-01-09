# Google Drive Extension for BluePLM

Sync files with Google Drive for backup and collaboration. Browse, edit, and manage your Google Drive files directly within BluePLM.

## Features

- **OAuth 2.0 Authentication** — Securely connect your Google account
- **File Browser** — Browse and navigate your Google Drive files
- **Bidirectional Sync** — Keep local and Drive files in sync
- **Configurable Sync** — Set intervals, direction, and exclusion patterns

## Installation

Install from the BluePLM Extension Store:

1. Open BluePLM → Settings → Extensions
2. Search for "Google Drive"
3. Click **Install**

## Configuration

After installation, navigate to **Settings → Extensions → Google Drive** to:

1. Connect your Google account
2. Configure sync interval (1–60 minutes)
3. Set sync direction (bidirectional, upload-only, download-only)
4. Add file exclusion patterns

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Package

Creates a `.bpx` file for distribution:

```bash
npm run package
```

### Type Check

```bash
npm run typecheck
```

## Releasing

This extension uses GitHub Actions for automated releases. When you push a tag, it automatically:

1. Runs type checking
2. Builds the extension
3. Packages it as a `.bpx` file
4. Creates a GitHub Release with the package attached
5. Extracts release notes from `CHANGELOG.md`

### Creating a Release

1. **Update the version** in both `package.json` and `extension.json`:

   ```json
   "version": "1.0.0"
   ```

2. **Update `CHANGELOG.md`** with release notes:

   ```markdown
   ## [1.0.0] - 2025-01-15

   ### Added
   - New feature description

   ### Fixed
   - Bug fix description
   ```

3. **Commit the changes**:

   ```bash
   git add .
   git commit -m "Release v1.0.0"
   ```

4. **Create and push a tag**:

   ```bash
   git tag v1.0.0
   git push origin main --tags
   ```

The GitHub Action will automatically create a release with the `.bpx` package attached.

### Pre-release Versions

Tags containing `-alpha`, `-beta`, or `-rc` are automatically marked as pre-releases:

```bash
git tag v1.0.0-beta.1
git push origin main --tags
```

## Project Structure

```
├── client/           # Client-side code (runs in Extension Host)
│   ├── index.ts      # Entry point with activate/deactivate
│   └── components/   # React UI components
├── server/           # Server-side handlers (runs in API sandbox)
│   ├── connect.ts    # OAuth initiation
│   ├── oauth-callback.ts
│   ├── status.ts     # Connection status
│   ├── sync.ts       # File synchronization
│   └── disconnect.ts
├── types/            # TypeScript type definitions
├── extension.json    # Extension manifest
└── package.json
```

## License

MIT — see [LICENSE](LICENSE)
