export function castExists<T>(  input: T | undefined | null,
  error: string = 'Expected the value to exist',
): T {
  assert(input !== undefined, error);
  assert(input !== null, error);
  return input;
}

export function assert(
  statement: boolean,
  error = 'Assertion error',
): asserts statement {
  if (!statement) {
    debugger;
    throw new Error(error);
  }
}
