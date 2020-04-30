/** @ignore */ /** */
/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { ProcessInfo, parsePSOutput, pExecFile } from "./utils";

/**
 * win32PSByWmic
 *
 * @returns array of processes
 */
async function win32PSByWmic(): Promise<ProcessInfo[]> {
  const { stdout, child } = await pExecFile("wmic.exe", [
    "PROCESS",
    "GET",
    "ParentProcessId,ProcessId,Name",
  ]);

  const wmPid = `${child.pid}`;
  const array = stdout.split("\n");
  // format:
  // Name                                                                ParentProcessId  ProcessId
  const ppidTag = "ParentProcessId";
  const heading = array.find((x) => x.includes(ppidTag));
  const ppix = heading.indexOf(ppidTag);
  const processes = array
    .map((line) => {
      const m = line
        .substr(ppix)
        .trim()
        .match(/^([0-9]+)\s+([0-9]+)/);

      if (m && m[2] !== wmPid) {
        const proc: ProcessInfo = {
          pid: parseInt(m[2], 10),
          ppid: parseInt(m[1], 10),
          command: line.substr(0, ppix).trim(),
        };
        return proc;
      }
      return null;
    })
    .filter((x) => x);

  return processes;
}

/**
 *
 * @returns array of processes
 */
async function win32PSByPowerShell(): Promise<ProcessInfo[]> {
  const { stdout, child } = await pExecFile("powershell.exe", [
    "Get-CimInstance",
    "Win32_Process",
    "|",
    "Format-Table",
    "ParentProcessId,ProcessId,Name",
  ]);
  return parsePSOutput(stdout, child.pid);
}

/**
 *
 * @returns array of processes
 */
export async function win32PS(): Promise<ProcessInfo[]> {
  try {
    return await win32PSByWmic();
  } catch {
    return await win32PSByPowerShell();
  }
}
