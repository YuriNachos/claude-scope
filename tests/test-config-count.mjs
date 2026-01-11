import { ConfigProvider } from "../src/providers/config-provider.js";
import { ConfigCountWidget } from "../src/widgets/config-count-widget.js";

async function test() {
  const provider = new ConfigProvider();
  const configs = await provider.getConfigs({ cwd: process.cwd() });

  console.log("Config counts:", JSON.stringify(configs, null, 2));

  const widget = new ConfigCountWidget();
  await widget.initialize();
  await widget.update({ cwd: process.cwd(), session_id: "test" });

  console.log("Widget enabled:", widget.isEnabled());
  const output = await widget.render({ width: 80, timestamp: Date.now() });
  console.log("Widget output:", output);
}

test().catch(console.error);
