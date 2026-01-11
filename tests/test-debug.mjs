import { main } from "../src/index.js";

main()
  .then((output) => {
    console.error("DEBUG: Output received, length:", output?.length);
    console.log(output);
  })
  .catch((err) => {
    console.error("DEBUG: caught error:", err.message);
    console.error(err.stack);
  });
