package com.nexora.command;

public class KillProcessCommand implements SystemCommand {
    private final int pid;
    private final String processName;

    public KillProcessCommand(int pid, String processName) {
        this.pid = pid;
        this.processName = processName;
    }

    @Override
    public String execute() {
        return "SIGKILL dispatched to process " + processName + " [PID " + pid + "]. Process terminated.";
    }

    @Override
    public String undo() {
        return "Spawn process " + processName + " reinstated.";
    }
}
