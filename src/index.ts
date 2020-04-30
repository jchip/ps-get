/**
 * @packageDocumentation
 * @module index
 */

/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { execFile } from "child_process";
import { promisify } from "util";
import { ProcessInfo, ProcessTreeInfo, parsePSOutput } from "./utils";
import { win32PS } from "./win32-ps";

/** @ignore */
export { ProcessInfo };
/** @ignore */
export { ProcessTreeInfo };

const pExecFile = promisify(execFile);

/**
 *
 * @returns array of processes
 */
async function unixPS(): Promise<ProcessInfo[]> {
  const promise = pExecFile("ps", ["-e", "-o", "ppid,pid,command"]);
  const { stdout } = await promise;
  return parsePSOutput(stdout, promise.child.pid);
}

const psFuncs = {
  win32: win32PS,
};

/**
 * ps
 *
 * Get list of system processes
 *
 * @returns array of processes
 */
export async function ps(): Promise<ProcessInfo[]> {
  return await (psFuncs[process.platform] || unixPS());
}

/**
 * psChildren
 *
 * List all child processes of a process ID
 *
 * @param ppid - ID for parent process
 * @param procs - List of processes instead of looking up from system
 *
 * @returns array of children process for ppid
 */
export async function psChildren(ppid: number, procs?: ProcessInfo[]): Promise<ProcessTreeInfo[]> {
  const levels = { [ppid]: 1 };

  const allProcs = procs || (await ps());

  const children = [];
  const used = {};

  let found = 0;

  do {
    found = 0;
    for (const proc of allProcs) {
      const level = levels[proc.ppid];
      if (!used[proc.pid] && level) {
        children.push({ ...proc, level });
        levels[proc.pid] = level + 1;
        used[proc.pid] = true;
        found++;
      }
    }
  } while (found > 0);

  return children.sort((a, b) => {
    // sort by level, ppid, pid
    if (a.level !== b.level) {
      return a.level - b.level;
    } else if (a.ppid !== b.ppid) {
      return a.ppid - b.ppid;
    } else {
      return a.pid - b.pid;
    }
  });
}
