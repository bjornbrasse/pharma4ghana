import type { Root } from "mdast";
import "mdast-util-directive";
import { visit } from "unist-util-visit";

export function remarkDirectives() {
  return (tree: Root) => {
    visit(tree, "containerDirective", (node) => {
      const data = node.data ?? (node.data = {});

      data.hName = "div";
      data.hProperties = {
        ...data.hProperties,
        "data-component": node.name,
      };
    });
  };
}
