# Plexcord

Plexcord is a custom [Vencord](https://vencord.dev/) plugin that adds client-side profile customisation, including custom usernames and badges.

> [!IMPORTANT]
> Plexcord only changes what is displayed in the Discord client. It does not change your real Discord username or grant official Discord badges.

## Requirements

Custom plugins require a source build of Vencord. Before installing Plexcord, install:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- Discord Desktop

You can install pnpm through npm:

```powershell
npm.cmd install -g pnpm
```

You can confirm that everything is installed by running:

```powershell
git -v
node -v
pnpm.cmd -v
```

## Installation

### 1. Download the Vencord source code

Open PowerShell in the folder where you want to keep Vencord, then run:

```powershell
git clone https://github.com/Vendicated/Vencord.git
cd Vencord
```

### 2. Install Vencord's dependencies

```powershell
pnpm.cmd install --frozen-lockfile
```

### 3. Install Plexcord

Create the custom-plugins directory:

```powershell
New-Item -ItemType Directory -Force -Path "src/userplugins" | Out-Null
```

Clone Plexcord into it:

```powershell
git clone https://github.com/absolutecc3d/Plexcord.git src/userplugins/Plexcord
```

The final structure must look like this:

```text
Vencord/
└── src/
    └── userplugins/
        └── Plexcord/
            └── index.ts
```
You may also see some other files like README.md, index.html and others
Do not leave the plugin inside an additional nested folder.

### 4. Build Vencord

From the main `Vencord` folder, run:

```powershell
pnpm.cmd build
```

### 5. Install the custom Vencord build

```powershell
pnpm.cmd inject
```

The Vencord Installer will open. Select your Discord installation and patch it.

Do not run the installer as Administrator.

### 6. Enable Plexcord

1. Fully close and reopen Discord.
2. Open **User Settings**.
3. Open **Vencord > Plugins**.
4. Search for **Plexcord**.
5. Enable the plugin.
6. Restart Discord when requested.

## Updating Plexcord

Open PowerShell in your Vencord folder and run:

```powershell
cd src/userplugins/Plexcord
git pull
cd ../../..
pnpm.cmd build
```

Restart Discord after the build finishes.

If Plexcord stops appearing after a Discord update, run:

```powershell
pnpm.cmd inject
```

## Updating Vencord

From the main Vencord folder:

```powershell
git pull
pnpm.cmd install --frozen-lockfile
pnpm.cmd build
```

Then restart Discord.

## Uninstalling Plexcord

Delete the Plexcord folder:

```powershell
Remove-Item -Recurse -Force "src/userplugins/Plexcord"
pnpm.cmd build
```

Restart Discord afterward.

## Troubleshooting

### Plexcord does not appear in the plugin list

Check that the entry file is located exactly here:

```text
Vencord/src/userplugins/Plexcord/index.ts
```

Then rebuild Vencord:

```powershell
pnpm.cmd build
```

### The build reports missing packages

Run:

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd build
```

### Discord no longer loads Vencord

Run:

```powershell
pnpm.cmd inject
```

Then patch the correct Discord installation again.

## Disclaimer

Plexcord is an unofficial third-party plugin and is not affiliated with Discord or Vencord.

Vencord states that Discord client modifications are against Discord's Terms of Service. Use client modifications at your own risk. Never share your Discord token with a plugin or installer.

Official Vencord documentation:

- [Installing Vencord from source](https://docs.vencord.dev/installing/)
- [Installing custom plugins](https://docs.vencord.dev/installing/custom-plugins/)
