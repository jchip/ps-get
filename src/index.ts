/**
 * @packageDocumentation
 * @module index
 */

/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { ProcessInfo, ProcessTreeInfo } from "./utils";
import { win32PS } from "./win32-ps";
import { unixPS } from "./unix-ps";

/** @ignore */
export { ProcessInfo, ProcessTreeInfo };

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
  return await (psFuncs[process.platform] || unixPS)();
}

/**
 * getChildrenOfPid
 *
 * find all child processes of a process ID from a list
 *
 * @param ppid - ID for parent process
 * @param procs - List of processes
 *
 * @returns array of children process for ppid
 */
export function getChildrenOfPid(ppid: number, procs: ProcessInfo[]): ProcessTreeInfo[] {
  const levels = { [ppid]: 1 };

  const children = [];
  const used = {};

  let found = 0;

  do {
    found = 0;
    for (const proc of procs) {
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

/**
 * psChildren
 *
 * List all child processes of a process ID
 *
 * @param ppid - ID for parent process
 *
 * @returns array of children process for ppid
 */
export async function psChildren(ppid: number): Promise<ProcessTreeInfo[]> {
  return getChildrenOfPid(ppid, await ps());
}
