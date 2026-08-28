package com.nexora.command;

/**
 * COMMAND PATTERN: Command interface for executable operations.
 */
public interface SystemCommand {
    String execute();
    String undo();
}
