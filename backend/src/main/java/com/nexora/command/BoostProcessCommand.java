package com.nexora.command;

public class BoostProcessCommand implements SystemCommand {
    private final int pid;
    private final String processName;

    public BoostProcessCommand(int pid, String processName) {
        this.pid = pid;
        this.processName = processName;
    }

    @Override
    public String execute() {
        return "Priority set to CRITICAL for process " + processName + " [PID " + pid + "]. Nice value: -20.";
    }

    @Override
    public String undo() {
        return "Priority restored to NORMAL for process " + processName + " [PID " + pid + "].";
    }
}
