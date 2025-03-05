# Rails Migration Boy

A Visual Studio Code extension designed to streamline Rails migration management. Run migration commands directly from your editor with CodeLens annotations or the Command Palette.

## Features

- **CodeLens Annotations**: When viewing a Rails migration file, see clickable "Up", "Down", and "Redo" options above the first line.
- **Command Palette Support**: Access all migration commands, including "Migrate All", from the Command Palette.
- **Version Detection**: Automatically extracts the migration version from the filename for precise command execution.

## Installation

1. **Via VS Code Marketplace**:

   - Open VS Code.
   - Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
   - Search for "Rails Migration Boy".
   - Click "Install".

2. **Manual Installation** (Optional):
   - Download the `.vsix` file from the Marketplace or build it locally.
   - In VS Code, go to Extensions view > "..." menu > "Install from VSIX".
   - Select the downloaded `.vsix` file.

## Usage

### CodeLens Commands

- Open a Rails migration file (e.g., `20230304123456_create_users.rb`) in the `db/migrate` directory.
- Above the first line, you'll see:
  - **Up**: Runs `rails db:migrate:up VERSION=<version>`
  - **Down**: Runs `rails db:migrate:down VERSION=<version>`
  - **Redo**: Runs `rails db:migrate:redo VERSION=<version>`
- Click any option to execute the command in a terminal.

### Command Palette

- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
- Type and select "Rails Migration Boy".
- Choose from:
  - **Migrate All**: Runs `rails db:migrate` (available always).
  - **Migrate Up**, **Migrate Down**, **Migrate Redo**: Available when a migration file is open.

### Requirements

- A Rails project with Ruby installed.
- Migration files following the standard naming convention (`<timestamp>_<name>.rb`).
- VS Code with CodeLens enabled (default setting: `"editor.codeLens": true`).

## Example

For a file named `20230304123456_create_users.rb`:

- Clicking "Up" runs: `rails db:migrate:up VERSION=20230304123456`
- From the Command Palette, selecting "Migrate All" runs: `rails db:migrate`

## Development

To contribute or modify the extension:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rails-migration-boy
   ```
