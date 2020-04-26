/* eslint-disable comma-dangle, no-irregular-whitespace, arrow-parens, no-magic-numbers */

import { ps, psChildren, ProcessTreeInfo } from "../../src";
import { expect } from "chai";

describe("ps", function () {
  it("should list all processes", async () => {
    const procs = await ps();
    expect(procs).to.be.an("Array").that.is.not.empty;
  });

  it("should list all children of proc id 1", async () => {
    const procs = await psChildren(1);
    expect(procs).to.be.an("Array").that.is.not.empty;
  });

  it("should handle children appear before another child-parent", async () => {
    const procs = [
      { pid: 453, ppid: 9, command: "random" },
      { pid: 900, ppid: 50, command: "child2" },
      { pid: 50, ppid: 20, command: "child1" },
      { pid: 20, ppid: 1, command: "top" },
      { pid: 901, ppid: 50, command: "child3" },
      { pid: 535, ppid: 99, command: "random" },
    ];
    const children: ProcessTreeInfo[] = await psChildren(1, procs);
    expect(children).to.deep.equal([
      { pid: 20, ppid: 1, command: "top", level: 1 },
      { pid: 50, ppid: 20, command: "child1", level: 2 },
      { pid: 900, ppid: 50, command: "child2", level: 3 },
      { pid: 901, ppid: 50, command: "child3", level: 3 },
    ]);
  });
});
