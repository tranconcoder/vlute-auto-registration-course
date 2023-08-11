import cliColor from "cli-color";

export const success = (message: string) => cliColor.green("✔", message);
export const error = (message: string) => cliColor.red("✖", message);
export const warning = (message: string) => cliColor.yellow(message);
