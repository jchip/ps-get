/**
 * @packageDocumentation
 * @module index
 */

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
export function parsePSOutput(stdout: string): ProcessInfo[] {
  return stdout
    .split("\n")
    .map((x) => {
      const m = x && x.trim().match(/(^[0-9]+)\s+([0-9]+)\s+(.*)/);
      return (
        m && {
          pid: parseInt(m[2], 10),
          ppid: parseInt(m[1], 10),
          command: m[3].trim(),
        }
      );
    })
    .filter((x) => x);
}
