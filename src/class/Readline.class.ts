import type { Interface } from "readline";

import { createInterface } from "readline";
import { stdin, stdout } from "process";

class Readline {
    private readline: Interface;

    public constructor() {
        this.readline = createInterface({
            input: stdin,
            output: stdout,
            terminal: true,
        });
    }

    public input(message: string): Promise<string> {
        return new Promise((resolve) => {
            this.readline.question(message, (result) => {
                resolve(result);
            });
        });
    }
}

const readline = new Readline();

export default readline;
