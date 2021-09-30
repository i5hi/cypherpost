/*
cypherpost.io
Developed @ Stackmate India
*/

export function handleError(error: any): Error {

  if (error instanceof Error) {
    error.name = "501";
    return error;
  }
  else if (
    typeof error === "object" &&
    error.hasOwnProperty("code") &&
    error.hasOwnProperty("message")

  ) {
    if (typeof (error.message) === 'object')
      error.message = JSON.stringify(error.message)

    const e = new Error(error.message);
    e.name = error.code.toString();
    return e;
  }
  else if (typeof error === "object") {
    const e = new Error(JSON.stringify(error, null, 2));
    e.name = "501";
    return e;
  }
  else if (typeof error === "string") {
    return new Error(error);
  }
  else if (error === undefined) return new Error("undefined");
  else {
    return new Error(error.toString());
  }
}
