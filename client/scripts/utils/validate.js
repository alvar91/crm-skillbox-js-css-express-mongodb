import { ValidationType, MAX_PHONE_LENGTH } from "../const.js";

const isNotEmpty = ({ value }) => {
  return !!value.trim();
};

const isPhone = ({ value }) => {
  const isCodeValid = value.indexOf(`+7`) === 0;
  const isCorrect = value.replace(/[-\+()]/g, ``).length === MAX_PHONE_LENGTH;

  return value && isCodeValid && isCorrect;
};

const isEmail = ({ value }) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(value);
};

export const validationMethods = (method, field) => {
  switch (method) {
    case ValidationType.notEmpty:
      return isNotEmpty(field);
    case ValidationType.isPhone:
      return isPhone(field);
    case ValidationType.isEmail:
      return isEmail(field);
    default:
      break;
  }
};

const allowSymbols = /^[а-яА-ЯёЁa-zA-Z0-9 -]+$/g;

export const formatInput = (field) => {
  field = field
    .split("")
    .filter((char) => char.match(allowSymbols) !== null)
    .join("")
    .trim()
    .toLowerCase()
    .replace(/^-+/g, "")
    .replace(/-+$/g, "")
    .replace(/ +(?= )/g, "")
    .replace(/-+/g, "-");

  return field.charAt(0).toUpperCase() + field.slice(1);
};
