/** @ignore */ /** */

/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { ProcessInfo, parsePSOutput, pExecFile } from "./utils";

/**
 * unixPS
 *
 * Get list of process through ps on Unix
 *
 * @returns array of processes
 */
export async function unixPS(): Promise<ProcessInfo[]> {
  const { stdout, child } = await pExecFile("ps", ["-e", "-o", "ppid,pid,command"]);
  return parsePSOutput(stdout, child.pid);
}
