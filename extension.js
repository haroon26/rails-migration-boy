const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

class MigrationCodeLensProvider {
  provideCodeLenses(document) {
    const fileName = path.basename(document.uri.fsPath);
    if (!fileName.match(/^\d{14}_.*\.rb$/)) {
      return [];
    }

    const range = new vscode.Range(0, 0, 0, 0); // Top of file
    return [
      new vscode.CodeLens(range, {
        title: "Up",
        command: "rails-migration-boy.migrateUp",
        arguments: [document.uri],
      }),
      new vscode.CodeLens(range, {
        title: "Down",
        command: "rails-migration-boy.migrateDown",
        arguments: [document.uri],
      }),
      new vscode.CodeLens(range, {
        title: "Redo",
        command: "rails-migration-boy.migrateRedo",
        arguments: [document.uri],
      }),
    ];
  }
}

function activate(context) {
  // Register CodeLens provider
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "ruby", pattern: "**/db/migrate/*.rb" },
      new MigrationCodeLensProvider()
    )
  );

  // Register Command Palette commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.migrateAll",
      async () => {
        await runMigrationCommand(null, "all");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.migrateUp",
      async (uri) => {
        const activeUri = uri || vscode.window.activeTextEditor?.document.uri;
        if (!activeUri || !isMigrationFile(activeUri)) {
          vscode.window.showErrorMessage(
            "No migration file is currently open."
          );
          return;
        }
        await runMigrationCommand(activeUri, "up");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.migrateDown",
      async (uri) => {
        const activeUri = uri || vscode.window.activeTextEditor?.document.uri;
        if (!activeUri || !isMigrationFile(activeUri)) {
          vscode.window.showErrorMessage(
            "No migration file is currently open."
          );
          return;
        }
        await runMigrationCommand(activeUri, "down");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.migrateRedo",
      async (uri) => {
        const activeUri = uri || vscode.window.activeTextEditor?.document.uri;
        if (!activeUri || !isMigrationFile(activeUri)) {
          vscode.window.showErrorMessage(
            "No migration file is currently open."
          );
          return;
        }
        await runMigrationCommand(activeUri, "redo");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.openLatestMigration",
      async () => {
        try {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("No workspace folder is open.");
            return;
          }

          const migrateDir = path.join(
            workspaceFolders[0].uri.fsPath,
            "db",
            "migrate"
          );
          const files = await fs.promises.readdir(migrateDir);
          const migrationFiles = files.filter((file) =>
            file.match(/^\d{14}_.*\.rb$/)
          );

          if (migrationFiles.length === 0) {
            vscode.window.showErrorMessage(
              "No migration files found in db/migrate."
            );
            return;
          }

          // Sort by timestamp (first 14 digits) in descending order
          migrationFiles.sort((a, b) => b.slice(0, 14) - a.slice(0, 14));
          const latestMigration = migrationFiles[0];
          const filePath = path.join(migrateDir, latestMigration);

          // Open the file in the editor
          const document = await vscode.workspace.openTextDocument(filePath);
          await vscode.window.showTextDocument(document);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Error opening latest migration: ${error.message}`
          );
        }
      }
    )
  );
}

async function runMigrationCommand(uri, action) {
  try {
    let command;

    if (action === "all") {
      command = "rails db:migrate";
    } else {
      const fileName = path.basename(uri.fsPath);
      const versionMatch = fileName.match(/^(\d{14})/);

      if (!versionMatch) {
        vscode.window.showErrorMessage("Invalid migration file format");
        return;
      }

      const version = versionMatch[0];
      command = `rails db:migrate:${action} VERSION=${version}`;
    }

    const terminal =
      vscode.window.activeTerminal ||
      vscode.window.createTerminal("Rails Migration Boy");
    terminal.show();
    terminal.sendText(command);
  } catch (error) {
    vscode.window.showErrorMessage(`Error running migration: ${error.message}`);
  }
}

function isMigrationFile(uri) {
  return path.basename(uri.fsPath).match(/^\d{14}_.*\.rb$/);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
