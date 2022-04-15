# Enumerator

I just needed a way to enumerate through every combination given a dynamic amount of options.

## Usage

If I was given a requirement like 6 characters and can only use numbers for the first 3 and letters for the last 5, I could cycle through each possible combination with this.

```javascript
const alphabet = "abcdefghijklmnopqrstuvwxyz".toUppercase().split("");
const requirements = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  alphabet,
  alphabet,
  alphabet,
];

const e = new Enumerator(requirements);
e.next(); // initializes
console.log(e.next());
// prints {value: [0,0,0,A,A,A], ...}
console.log(e.next());
// prints {value: [1,0,0,A,A,A], ...}
```

## Test

Make sure you have deno installed from deno.land. Try version 1.20.

```
deno task test
```
