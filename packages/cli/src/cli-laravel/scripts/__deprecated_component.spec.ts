import { getVariadicArguments } from "../../getVariadicArguments";

/**
 * Simply mock a command by exposing global `argv` implictly parsed by
 * commander's `program.parse()`.
 */
function mockCommand(command: string, ...args: string[]) {
  // process.argv = ["pm", command, ...args];
  jest.replaceProperty(process, "argv", ["pm", command, ...args]);
}

// afterEach(() => {
//   // process.argv = [];
//   jest.replaceProperty(process, "argv", []);
// });

test("parse multiple variadic argument", async () => {
  mockCommand("component", "header", "footer");

  const program = await (await import("./component")).program;

  const args = program.args;
  expect(args[0]).toBe("header");
});

test("parse single variadic argument as comma separated string", async () => {
  mockCommand("component", "header,footer");

  const program = await (await import("./component")).program;

  const args = getVariadicArguments(program.args);

  expect(args).toContain("header");
  expect(args).toContain("footer");
});
