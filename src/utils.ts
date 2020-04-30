/**
 * @packageDocumentation
 * @module index
 */

import { execFile, ChildProcess } from "child_process";

/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

/**
 * Process Info
 */
export type ProcessInfo = {
  /**
   * Process ID
   */
  pid: number;
  /**
   * Parent Process ID
   */
  ppid: number;
  /**
   * Command that started process
   */
  command: string;
};

/**
 * Process Info for children tree
 */
export type ProcessTreeInfo = ProcessInfo & {
  /**
   * Tree level starting at 1
   */
  level: number;
};

/**
 * @ignore
 * parseOutput
 *
 * Parse output from PS program into array of processes
 *
 * @param stdout - output from ps program
 *
 * @returns array of processes
 */
export function parsePSOutput(stdout: string, psPid: number): ProcessInfo[] {
  const sPsPid = `${psPid}`;
  return stdout
    .split("\n")
    .map((x) => {
      const m = x && x.trim().match(/(^[0-9]+)\s+([0-9]+)\s+(.*)/);
      return (
        m &&
        m[2] !== sPsPid && {
          pid: parseInt(m[2], 10),
          ppid: parseInt(m[1], 10),
          command: m[3].trim(),
        }
      );
    })
    .filter((x) => x);
}

export type ExecResult = { stdout: string; stderr: string; child: ChildProcess };

/**
 * @ignore
 * pExecFile
 *
 * Promisified execFile (cuz Node 10 util.promisify doesn't return child)
 *
 * @param file - file to exec
 * @param args - args to pass to the file
 * @returns array of processes
 */

export async function pExecFile(file: string, args?: readonly string[]): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    const child = execFile(file, args, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr, child });
      }
    });
  });
}
