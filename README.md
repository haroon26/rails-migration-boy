# Rails Migration Boy

A Visual Studio Code extension designed to streamline Rails migration management. Run migration commands directly from your editor with CodeLens annotations or the Command Palette.

## Features

- **CodeLens Annotations**: When viewing a Rails migration file, see clickable "Up", "Down", and "Redo" options above the first line.
- **Command Palette Support**: Access all migration commands directly in the Command Palette.
- **Version Detection**: Automatically extracts the migration version from the filename for precise command execution.
- **Open Latest Migration**: Quickly jump to the most recent migration file in your project.

## Installation

1. **Via VS Code Marketplace**:

   - Open VS Code.
   - Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
   - Search for "Rails Migration Boy".
   - Click "Install".

## Usage

### CodeLens Commands

- Open a Rails migration file (e.g., `20230304123456_create_users.rb`) in the `db/migrate` directory.
- Above the first line, you’ll see:
  - **Up**: Runs `rails db:migrate:up VERSION=<version>`
  - **Down**: Runs `rails db:migrate:down VERSION=<version>`
  - **Redo**: Runs `rails db:migrate:redo VERSION=<version>`
- Click any option to execute the command in a terminal.

### Command Palette

- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
- Type "Rails Migration Boy" to see the available commands:
  - **Rails Migration Boy: Migrate All**: Runs `rails db:migrate` (always available).
  - **Rails Migration Boy: Migrate Up**: Runs `rails db:migrate:up VERSION=<version>` (requires an open migration file).
  - **Rails Migration Boy: Migrate Down**: Runs `rails db:migrate:down VERSION=<version>` (requires an open migration file).
  - **Rails Migration Boy: Migrate Redo**: Runs `rails db:migrate:redo VERSION=<version>` (requires an open migration file).
  - **Rails Migration Boy: Open Latest Migration**: Opens the most recent migration file from `db/migrate` in the editor (available if a workspace with `db/migrate` is open).
- Select a command to execute it. If "Up", "Down", or "Redo" is chosen without an open migration file, an error message will appear: "No migration file is currently open."

### Requirements

- A Rails project with Ruby installed.
- Migration files following the standard naming convention (`<timestamp>_<name>.rb`).
- VS Code with CodeLens enabled (default setting: `"editor.codeLens": true`).

## Examples

For a file named `20230304123456_create_users.rb`:

- Clicking "Up" in CodeLens runs: `rails db:migrate:up VERSION=20230304123456`
- From the Command Palette:
  - Selecting "Rails Migration Boy: Migrate All" runs: `rails db:migrate`
  - Selecting "Rails Migration Boy: Migrate Redo" with the file open runs: `rails db:migrate:redo VERSION=20230304123456`
  - Selecting "Rails Migration Boy: Open Latest Migration" opens the most recent file (e.g., `20230304123456_create_users.rb` if it’s the latest).

## Development

To contribute or modify the extension:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rails-migration-boy
   ```
