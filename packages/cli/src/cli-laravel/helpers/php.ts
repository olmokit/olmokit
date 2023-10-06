// FIXME: php parser typing
import { readFileSync } from "node:fs";
import {
  Engine,
  /* , type Node */
} from "php-parser";

export function getFileClass(filepath: string) /* : Node | undefined  */ {
  const parser = new Engine({
    parser: {
      php7: true,
    },
  });
  const phpFile = readFileSync(filepath, "utf-8");

  try {
    const program = parser.parseCode(phpFile, filepath);

    for (let i = 0; i < program.children.length; i++) {
      const child = program.children[i];
      if (child.kind === "namespace") {
        // @ts-expect-error php-parser
        for (let j = 0; j < child.children.length; j++) {
          // @ts-expect-error php-parser
          const subChild = child.children[j];
          if (subChild.kind === "class") {
            return subChild;
          }
        }
      } else if (child.kind === "class") {
        return child;
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return;
}

/**
 * Get PHP class property value
 *
 * @param source Either an already parse PHP class or a filepath to a php file
 */
export function getClassPropertyValue(
  propertyName: string,
  source: string | object,
) {
  const phpClass = typeof source === "string" ? getFileClass(source) : source;

  if (phpClass) {
    for (let i = 0; i < phpClass.body.length; i++) {
      const element = phpClass.body[i];
      if (element.kind === "propertystatement") {
        for (let j = 0; j < element.properties.length; j++) {
          const property = element.properties[j];
          if (property.name.name === propertyName) {
            return property.value.value;
          }
        }
      }
    }
  }

  return;
}

/**
 * Converts a file path to a php namespace syntax
 */
export function filePathToNamespace(prefix = "", filePath = "") {
  const fullPath = prefix + "/" + filePath.replace(".php", "");

  return `\\${fullPath.replace(/\//g, "\\")}`;
}
