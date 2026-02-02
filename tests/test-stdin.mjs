import fs from "node:fs";
import { StdinProvider } from "../src/data/stdin-provider.js";

const stdin = fs.readFileSync("/tmp/test-cli.json", "utf8");
const provider = new StdinProvider();

provider
  .parse(stdin)
  .then((data) => {
    console.log("Parsed successfully!");
    console.log("Session ID:", data.session_id);
    console.log("Model:", data.model?.display_name);
    console.log("Cost:", data.cost?.total_cost);
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
