interface ValidityObject {
  patternMismatch: boolean;
  valueMissing: boolean;
  tooLong: boolean;
  tooShort: boolean;
  typeMismatch: boolean;
}

export default (validity: ValidityObject, values?: string[] | null): string => {
  let errorMessage = '';

  if (validity.patternMismatch) {
    errorMessage = 'Некорректно введено';
  } else if (validity.valueMissing) {
    errorMessage = 'Поле не заполнено';
  } else if (validity.tooLong || validity.tooShort) {
    errorMessage = 'Некорректная длина';
  } else if (validity.typeMismatch) {
    errorMessage = 'Неверный тип';
  } else if (values && values[0] !== values[1]) {
    errorMessage = 'Пароли не совпадают';
  }

  return errorMessage;
};
