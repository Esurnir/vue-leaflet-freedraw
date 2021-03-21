export default function remapEvents(
  contextAttrs: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const attrName in contextAttrs) {
    if (
      attrName.startsWith('on') &&
      !attrName.startsWith('onUpdate') &&
      attrName !== 'onReady'
    ) {
      const eventName = attrName.slice(2).toLocaleLowerCase();
      result[eventName] = contextAttrs[attrName];
    }
  }
  return result;
}
