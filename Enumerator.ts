type DialArray = (string | number)[]; // keep it simple

class Dial {
  index = 0;
  shouldMoveAdjacentDial = false;
  _current = undefined;
  values: DialArray;
  constructor(arr: DialArray) {
    this.values = arr;
  }

  next() {
    const val = this.values[this.index];
    if (this.index >= this.values.length - 1) {
      this.index = 0;
      this.shouldMoveAdjacentDial = true;
    } else {
      this.index += 1;
      this.shouldMoveAdjacentDial = false;
    }
    return val;
  }

  call() {
    // this is important to make multiple dials move all the adjacent dials correctly
    // if I was smart enought to figure out how to use a nested generator, that would probably be the way to go
    this.shouldMoveAdjacentDial = false;
    return this.values[this.index];
  }

  get current() {
    // does not affect any adjacent dials
    return this.values[this.index];
  }

  get length() {
    return this.values.length;
  }

  reset() {
    this.index = 0;
    this.shouldMoveAdjacentDial = false;
    return this.values[this.index];
  }
}

export class Enumerator {
  private _current: DialArray | undefined = undefined;
  private dials: Dial[];
  count: number;
  index = 0;
  constructor(
    arrs: DialArray[],
    options = {
      /*isRightToLeft = false*/
    }
  ) {
    this.dials = arrs.map((a) => new Dial(a));
    this.count = this.dials.reduce((acc, val) => acc * val.length, 1);
    // this.isRightToLeft = isRightToLeft;
    this.reset();
  }

  get current() {
    return this._current;
  }

  iterate() {
    const boundNext = this.next.bind(this);
    return {
      [Symbol.iterator]() {
        return {
          next: () => boundNext(),
        };
      },
    };
  }

  next() {
    try {
      if (this.index >= this.count) return { value: undefined, done: true };
      let previousArray = this.dials[0];
      let array = this.dials.map((a, arrIndex) => {
        let val;
        if (arrIndex === 0) val = a.next();
        else if (previousArray.shouldMoveAdjacentDial) val = a.next();
        else val = a.call();

        previousArray = a;
        return val;
      });
      // if (this.isRightToLeft) array = array.reverse();
      this._current = array;
      this.index += 1;
      return { value: array, done: false };
    } catch (err) {
      console.error(err);
      console.log(`Last call was ${this._current?.toString()}`);
      return { value: undefined, done: true };
    }
  }

  random() {
    return this.dials.map((d) => {
      const index = Math.floor(Math.random() * d.length);
      return d.values[index];
    });
  }

  reset() {
    let array = this.dials.map((d) => d.reset());
    // if (this.isRightToLeft) array = array.reverse();
    this._current = array;
    this.index = 0;
    return array;
  }

  setTo(arr: DialArray, { index = 0 } = {}) {
    if (!Array.isArray(arr))
      throw new Error("Invalid setTo argument. Must be an array");
    if (arr.length !== this.dials.length)
      throw new Error(
        `Invalid setTo argument [${arr}]. Cannot setTo an array with a length of ${arr.length}. Length must be ${this.dials.length}.`
      );
    const validIndexes: number[] = [];
    this.dials.forEach((a, idx) => {
      const index = a.values.indexOf(arr[idx]);
      if (index < 0)
        throw new Error(
          `Invalid setTo argument [${arr}]. Cannot setTo "${
            arr[idx]
          }" at index ${idx}. Available values are ${a.values.toString()}.`
        );
      validIndexes.push(index);
    });

    // Wait to change indexes until we are sure everything we received was valid
    this.dials.forEach((a, idx) => (a.index = validIndexes[idx]));
    this._current = arr;
    this.index = index;
  }

  get size() {
    return this.dials.length;
  }
}
