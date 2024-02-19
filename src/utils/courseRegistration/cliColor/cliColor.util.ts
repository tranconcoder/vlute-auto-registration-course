import cliColor from "cli-color";

export const success = (
    message: string,
    option: { icon: boolean } = { icon: true }
) => cliColor.green(option.icon ? "✔" : "", message);

export const error = (
    message: string,
    option: { icon: boolean } = { icon: true }
) => cliColor.red(option.icon ? "✖" : "", message);

export const warning = (
    message: string,
    option: { icon: boolean } = { icon: true }
) => cliColor.yellow(message);
