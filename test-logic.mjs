// Test the widget logic
const current_usage = null;
const cachedUsage = {input_tokens: 44216, output_tokens: 155, cache_read_input_tokens: 4096, cache_creation_input_tokens: 0};

let usage = current_usage;

const hasRealUsage = usage && (
  (usage?.input_tokens ?? 0) > 0 ||
  (usage?.output_tokens ?? 0) > 0 ||
  (usage?.cache_read_input_tokens ?? 0) > 0 ||
  (usage?.cache_creation_input_tokens ?? 0) > 0
);

console.log('current_usage:', current_usage);
console.log('hasRealUsage:', hasRealUsage);
console.log('!usage:', !usage);
console.log('(!usage || !hasRealUsage):', (!usage || !hasRealUsage));
console.log('cachedUsage:', cachedUsage);

if ((!usage || !hasRealUsage) && cachedUsage) {
  usage = cachedUsage;
  console.log('USING CACHED USAGE!');
  console.log('Final usage:', usage);
}
