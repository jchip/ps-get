/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { ps, psChildren, getChildrenOfPid } from "../../src";
import { pExecFile } from "../../src/utils";
import { execFile } from "child_process";
import { expect } from "chai";

describe("ps", function () {
  it("should list all processes without ps itself", async () => {
    const procs = await ps();
    expect(procs).to.be.an("Array").that.is.not.empty;
    expect(procs.find((p) => p.command.startsWith("ps") && p.ppid === process.pid)).to.equal(
      undefined
    );
  });

  it("should list all children of this proc", async () => {
    const child = execFile("node", ["-e", "setTimeout(() => {}, 10000);"]);
    const procs = await psChildren(process.pid);
    expect(procs).to.be.an("Array").that.is.not.empty;
    expect(procs[0].pid).to.equal(child.pid);
    child.kill();
  });

  it("should handle children appear before another child-parent", async () => {
    const procs = [
      { pid: 453, ppid: 9, command: "random" },
      // here is a child of PID 50, which doesn't appear until later
      { pid: 900, ppid: 50, command: "child2" },
      { pid: 953, ppid: 20, command: "child4" },
      { pid: 903, ppid: 25, command: "child5" },
      // PID 50
      { pid: 50, ppid: 20, command: "child1" },
      { pid: 20, ppid: 1, command: "top" },
      { pid: 25, ppid: 1, command: "top" },
      { pid: 901, ppid: 50, command: "child3" },
      { pid: 943, ppid: 25, command: "child6" },
      { pid: 535, ppid: 99, command: "random" },
    ];
    const children = getChildrenOfPid(1, procs);
    expect(children).to.deep.equal([
      { pid: 20, ppid: 1, command: "top", level: 1 },
      { pid: 25, ppid: 1, command: "top", level: 1 },
      { pid: 50, ppid: 20, command: "child1", level: 2 },
      { pid: 953, ppid: 20, command: "child4", level: 2 },
      { pid: 903, ppid: 25, command: "child5", level: 2 },
      { pid: 943, ppid: 25, command: "child6", level: 2 },
      { pid: 900, ppid: 50, command: "child2", level: 3 },
      { pid: 901, ppid: 50, command: "child3", level: 3 },
    ]);
  });

  it("should throw if execFile can't find binary", async () => {
    try {
      await pExecFile("/fooblah");
      throw new Error("expected failure");
    } catch {
      //
    }
  });
});
