import { getWithAuth, updateWithAuth } from "./utils/fetch.js";
import { showErrorMessage, showMessage } from "./utils/message-box.js";
import {
  isValidField,
  allRegexExp,
  isValidDate,
  minDate,
  AccountStatusEnum,
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

async function updateUserAccount(URL, data) {
  try {
    const response = await updateWithAuth(URL, "PUT", data);
    response.ok &&
      (await showMessage(
        "info",
        "Dados de utilizador atualizados com sucesso",
        ["Continuar"],
        "Dados atualizados"
      ));
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

export async function validateInputData(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const username = formData.get("username");
  const email = formData.get("email_addr");
  const phone = formData.get("phone_number");
  const birthDate = formData.get("birth_date");
  const isActiveAccount = activeAccountCheckbox.dataset.status === "active";
  const URL = form.action;
  let status;

  if (isActiveAccount && activeAccountCheckbox.checked) {
    status = AccountStatusEnum.inactive;
  } else if (!isActiveAccount && activeAccountCheckbox.checked) {
    status = AccountStatusEnum.active;
  }

  if (!username.length || !isValidField(allRegexExp.username, username)) {
    return await showErrorMessage("Campo Nome inválido");
  } else if (!email.length || !isValidField(allRegexExp.email, email)) {
    return await showErrorMessage("Campo Email inválido");
  }

  if (phone.length !== 0 && !isValidField(allRegexExp.phoneNumber, phone)) {
    return await showErrorMessage("Número de telemóvel inválido");
  }

  if (birthDate && !isValidDate(birthDate)) {
    return await showErrorMessage("Data inválida");
  }

  const data = {
    username,
    email_addr: email,
    phone_number: phone,
    birth_date: birthDate,
  };

  if (
    status === AccountStatusEnum.active ||
    status === AccountStatusEnum.inactive
  ) {
    data["is_active"] = status;
  }

  await updateUserAccount(URL, data);
}
