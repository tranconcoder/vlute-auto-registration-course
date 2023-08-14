import prompt from "prompt-sync";
import promptHistory from "prompt-sync-history";

export default prompt({
    history: promptHistory(),
});
