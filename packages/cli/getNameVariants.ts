import { camelCase, paramCase, pascalCase, sentenceCase } from "change-case";

export function getNameVariants(givenName: string) {
  return {
    slug: paramCase(givenName),
    name: sentenceCase(givenName),
    className: pascalCase(givenName),
    instanceName: camelCase(givenName),
  };
}
