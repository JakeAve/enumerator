import {
  assertEquals,
  assertInstanceOf,
} from "https://deno.land/std@0.134.0/testing/asserts.ts";
import { Enumerator } from "./Enumerator.ts";

const a = [
  [1, 2, 3],
  ["a", "b"],
  ["A", "B", "C", "D"],
  ["foo", "buzz"],
];

const b = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

const c = [
  [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
];

Deno.test("Enumerator constructor works", () => {
  const e = new Enumerator(a);
  assertInstanceOf(e, Enumerator);
});

Deno.test("Can count the correct number of combinations", () => {
  const e = new Enumerator(a);
  assertEquals(e.count, 48);

  const e2 = new Enumerator(b);
  assertEquals(e2.count, 10000);

  const e3 = new Enumerator(c);
  assertEquals(e3.count, 17576);
});

Deno.test("Will know the size", () => {
  const e = new Enumerator(a);
  assertEquals(e.size, 4);

  const e2 = new Enumerator(b);
  assertEquals(e2.size, 4);

  const e3 = new Enumerator(c);
  assertEquals(e3.size, 3);
});

Deno.test("Current starts as first indexes", () => {
  const e = new Enumerator(a);
  assertEquals(e.current, [1, "a", "A", "foo"]);

  const e2 = new Enumerator(b);
  assertEquals(e2.current, [0, 0, 0, 0]);

  const e3 = new Enumerator(c);
  assertEquals(e3.current, ["a", "a", "a"]);
});

Deno.test("Next iterates correctly", () => {
  const e = new Enumerator(a);
  e.next();
  assertEquals(e.next().value, [2, "a", "A", "foo"]);
  assertEquals(e.current, [2, "a", "A", "foo"]);
  for (let i = 0; i < 4; i++) e.next();
  assertEquals(e.current, [3, "b", "A", "foo"]);

  const e2 = new Enumerator(b);
  e2.next();
  assertEquals(e2.next().value, [1, 0, 0, 0]);
  assertEquals(e2.current, [1, 0, 0, 0]);
  for (let i = 0; i < 100; i++) e2.next();
  assertEquals(e2.current, [1, 0, 1, 0]);

  const e3 = new Enumerator(c);
  e3.next();
  assertEquals(e3.next().value, ["b", "a", "a"]);
  assertEquals(e3.current, ["b", "a", "a"]);
  for (let i = 0; i < 1000; i++) e3.next();
  assertEquals(e3.current, ["n", "m", "b"]);
});

Deno.test("Sets appropriately", () => {
  const e = new Enumerator(a);
  e.setTo([3, "b", "A", "foo"]);
  assertEquals(e.current, [3, "b", "A", "foo"]);
  e.next(); // should this line shouldn't be necessary?
  assertEquals(e.next().value, [1, "a", "B", "foo"]);
});

Deno.test("Iterates through all options", () => {
  const e = new Enumerator(a);
  const results = [...e.iterate()];
  assertEquals(results.length, 48);
  assertEquals(results[0], [1, "a", "A", "foo"]);
  assertEquals(results[47], [3, "b", "D", "buzz"]);
});

Deno.test("Reset works", () => {
  const e = new Enumerator(a);
  e.next();
  e.next();
  e.reset();
  assertEquals(e.current, [1, "a", "A", "foo"]);
});
