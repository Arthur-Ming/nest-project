export function expectValidationError(resBody: any, validationFields: Array<string>) {
  expect(resBody).toEqual({
    errorsMessages: expect.any(Array),
  });

  expect(resBody.errorsMessages.sort((a, b) => a.field.localeCompare(b.field))).toMatchObject(
    validationFields
      .map((field) => ({
        message: expect.any(String),
        field,
      }))
      .sort((a, b) => a.field.localeCompare(b.field))
  );
}
