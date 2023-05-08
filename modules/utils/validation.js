export const minDate = Date.parse("1920-01-01");

export function isValidDate(date) {
  const sentDate = Date.parse(date);
  if (sentDate > Date.now() || sentDate < minDate) {
    return false;
  }
  return true;
}

export function isValidField(regex, text) {
  return regex.test(text);
}

export const allRegexExp = {
  username: /^(\p{L}{2,}\p{Zs}?)+$/u,
  email: /^\w+@\w+\.[a-zA-Z]{2,}$/,
  phoneNumber: /(^(\d\s?){9}$)|(^\+(\d\s?){12}$)/,
};

export const AccountStatusEnum = Object.create(Object, {
  active: {
    writable: false,
    configurable: false,
    enumerable: true,
    value: 1,
  },
  inactive: {
    writable: false,
    configurable: false,
    enumerable: true,
    value: 0,
  },
});
