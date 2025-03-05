const vscode = require("vscode");
const path = require("path");

class MigrationCodeLensProvider {
  provideCodeLenses(document, token) {
    const fileName = path.basename(document.uri.fsPath);
    if (!fileName.match(/^\d{14}_.*\.rb$/)) {
      return [];
    }

    const range = new vscode.Range(0, 0, 0, 0); // Top of file
    return [
      new vscode.CodeLens(range, {
        title: "Up",
        command: "rails-migration-boy.runUp",
        arguments: [document.uri],
      }),
      new vscode.CodeLens(range, {
        title: "Down",
        command: "rails-migration-boy.runDown",
        arguments: [document.uri],
      }),
      new vscode.CodeLens(range, {
        title: "Redo",
        command: "rails-migration-boy.runRedo",
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

  // Command Palette command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rails-migration-boy.showCommands",
      async () => {
        const activeEditor = vscode.window.activeTextEditor;
        let uri;
        let isMigrationFile = false;
        if (activeEditor) {
          uri = activeEditor.document.uri;
          isMigrationFile = path.basename(uri.fsPath).match(/^\d{14}_.*\.rb$/);
        }

        const options = [
          {
            label: "Migrate All",
            description: "Run rails db:migrate",
            value: "all",
          },
        ];

        if (isMigrationFile) {
          options.push(
            {
              label: "Migrate Up",
              description: "Run rails db:migrate:up",
              value: "up",
            },
            {
              label: "Migrate Down",
              description: "Run rails db:migrate:down",
              value: "down",
            },
            {
              label: "Migrate Redo",
              description: "Run rails db:migrate:redo",
              value: "redo",
            }
          );
        }

        const selected = await vscode.window.showQuickPick(options, {
          placeHolder: "Select a migration command",
          matchOnDescription: true,
        });

        if (selected) {
          await runMigrationCommand(uri, selected.value);
        }
      }
    )
  );

  // CodeLens commands
  context.subscriptions.push(
    vscode.commands.registerCommand("rails-migration-boy.runUp", (uri) => {
      runMigrationCommand(uri, "up");
    }),
    vscode.commands.registerCommand("rails-migration-boy.runDown", (uri) => {
      runMigrationCommand(uri, "down");
    }),
    vscode.commands.registerCommand("rails-migration-boy.runRedo", (uri) => {
      runMigrationCommand(uri, "redo");
    })
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

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
