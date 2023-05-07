import { getWithAuth } from "./utils/fetch.js";
import { showErrorMessage } from "./utils/message-box.js";
import {
  isValidField,
  allRegexExp,
  isValidDate,
  minDate,
} from "./utils/validation.js";

const form = document.getElementById("update-form");
const usernameInput = document.querySelector('input[name="username"]');
const emailInput = document.querySelector('input[name="email_addr"]');
const phoneInput = document.querySelector('input[name="phone_number"]');
const dateInput = document.querySelector('input[name="birth_date"]');
const activeAccountCheckbox = document.querySelector('input[name="is_active"]');

const BASE_URL = "http://localhost:3000/users";

function checkUserAccountStatus(isActive) {
  let checkboxParent = activeAccountCheckbox.closest("div");
  let checkboxSpan = checkboxParent.querySelector("span");
  if (isActive) {
    checkboxSpan.textContent = "Desativar conta";
    activeAccountCheckbox.setAttribute("data-status", "active");
    return;
  }
  checkboxSpan.textContent = "Ativar conta";
  activeAccountCheckbox.setAttribute("data-status", "inactive");
  return;
}

function handleDate(date) {
  const year = date.getFullYear(date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return (
    `${year}-` +
    `${month < 10 ? `0${month}` : month}-` +
    `${day < 10 ? `0${day}` : day}`
  );
}

export async function fillForm({ currentTarget }) {
  const userId = currentTarget.dataset.userid;
  try {
    const response = await getWithAuth(`${BASE_URL}/${userId}`);
    const { user } = await response.json();
    form.action &&= `${BASE_URL}/${userId}`;

    usernameInput.value = user.username;
    emailInput.value = user.UserLoginDatum?.email_addr ?? "";
    phoneInput.value = user.phone_number;
    dateInput.value = user.birth_date;
    dateInput.min = handleDate(new Date(minDate));
    dateInput.max = handleDate(new Date(Date.now()));
    checkUserAccountStatus(user.is_active);
  } catch (err) {
    console.error(err);
  }
}

export async function validateInputData(event) {
  event.preventDefault();
  if (
    !usernameInput.value.length ||
    !isValidField(allRegexExp.username, usernameInput.value)
  ) {
    return await showErrorMessage("Campo Nome inválido");
  } else if (
    !emailInput.value.length ||
    !isValidField(allRegexExp.email, emailInput.value)
  ) {
    return await showErrorMessage("Campo Email inválido");
  }

  if (
    phoneInput.value.length !== 0 &&
    !isValidField(allRegexExp.phoneNumber, phoneInput.value)
  ) {
    return await showErrorMessage("Número de telemóvel inválido");
  }

  if (dateInput.value && !isValidDate(dateInput.value)) {
    return await showErrorMessage("Data inválida");
  }
}
