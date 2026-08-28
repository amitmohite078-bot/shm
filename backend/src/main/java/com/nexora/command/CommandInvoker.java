package com.nexora.command;

import java.util.Stack;

public class CommandInvoker {
    private final Stack<SystemCommand> history = new Stack<>();

    public String executeCommand(SystemCommand command) {
        String result = command.execute();
        history.push(command);
        return result;
    }

    public String undoLastCommand() {
        if (!history.isEmpty()) {
            SystemCommand last = history.pop();
            return last.undo();
        }
        return "NO COMMANDS IN HISTORY";
    }
}
