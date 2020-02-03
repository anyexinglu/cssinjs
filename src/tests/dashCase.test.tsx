// Reference: https://github.com/rexxars/hyphenate-style-name/blob/master/test/hyphenate-style-name.test.js

import { dashCase } from "../utils";

test("hyphenates regular css", () => {
  testSet([
    ["backgroundColor", "background-color"],
    ["fontSize", "font-size"],
    ["color", "color"],
    ["borderTopLeftRadius", "border-top-left-radius"]
  ]);
});

test("hyphenates vendor prefixes correctly", () => {
  testSet([
    ["MozTransition", "-moz-transition"],
    ["msTransition", "-ms-transition"],
    ["WebkitTransition", "-webkit-transition"]
  ]);
});

test("delivers consistent result on multiple runs (memoized)", () => {
  testSet([
    ["backgroundColor", "background-color"],
    ["backgroundColor", "background-color"],
    ["fontSize", "font-size"],
    ["fontSize", "font-size"],
    ["color", "color"],
    ["color", "color"],
    ["borderTopLeftRadius", "border-top-left-radius"],
    ["borderTopLeftRadius", "border-top-left-radius"]
  ]);
});

function testSet(dataSet: string[][]) {
  dataSet.forEach(set => {
    expect(dashCase(set[0])).toBe(set[1]);
  });
}
