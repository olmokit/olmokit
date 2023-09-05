#!/usr/bin/env node
import tsNode from "ts-node";
import { cli } from "../cli";

tsNode.register();

cli();

// #!/usr/bin/env ts-node
// import { cli } from "../cli.js";

// cli();
