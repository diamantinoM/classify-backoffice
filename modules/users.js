import { showErrorMessage, showMessage } from "./utils/message-box.js";
import { getWithAuth, deleteWithAuth } from "./utils/fetch.js";

const inactiveUsersBtn = document.getElementById("inactive_users");
const activeUsersBtn = document.getElementById("active_users");
const pActive = document.getElementById("p_active");
const pInactive = document.getElementById("p_inactive");
const userStatus = { isActive: true, isInactive: false };
let totalUsers = [];

async function showAllUsers() {
  try {
    const response = await getWithAuth("http://localhost:3000/users");
    const { users } = await response.json();
    totalUsers = users;
    const inactiveUsers = users.filter(
      (user) => user.is_active === userStatus.isInactive
    );
    if (inactiveUsers.length === 0) {
      renderUsers(users, userStatus.isActive);
    } else {
      renderUsers(users, userStatus.isInactive);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteUser({ currentTarget }) {
  const userId = currentTarget.dataset.userid;
  const infoBox = await showMessage(
    "info",
    "Tem certeza que deseja excluir este utilizador?",
    ["Sim", "Cancelar"],
    "Eliminar utilizador",
    { cancelId: 1 }
  );
  if (infoBox.response === 1) {
    return;
  }
  try {
    const response = await deleteWithAuth(
      `http://localhost:3000/users/${userId}`
    );
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

function renderUsers(data, status) {
  const allUsers = data;
  const activeUsers = allUsers.filter(
    (user) => user.is_active === userStatus.isActive
  );
  const inactiveUsers = allUsers.filter(
    (user) => user.is_active === userStatus.isInactive
  );
  const users = allUsers.filter((user) => user.is_active === status); // ad_status_id

  pInactive.textContent = `${inactiveUsers.length} Utilizadores`;
  pActive.textContent = `${activeUsers.length} Utilizadores`;

  const tableBody = document.querySelector(".ads_table tbody");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    let promoCounter = user.Ads.filter((ad) => ad.promo_id !== 1).length;

    const row = document.createElement("tr");

    const checkboxElement = document.createElement("td");
    checkboxElement.classList.add("checkbox");

    const divCheckBox = document.createElement("div");
    divCheckBox.classList.add("table_checkbox");
    const inputCheckBox = document.createElement("input");
    inputCheckBox.setAttribute("type", "checkbox");
    inputCheckBox.setAttribute("id", `checkbox${user.user_id}`);
    const labelCheckBox = document.createElement("label");
    labelCheckBox.setAttribute("for", `checkbox${user.user_id}`);
    divCheckBox.append(inputCheckBox, labelCheckBox);
    checkboxElement.appendChild(divCheckBox);
    row.appendChild(checkboxElement);

    const photoElement = document.createElement("td");
    photoElement.classList.add("photo");

    const divPhoto = document.createElement("div");
    divPhoto.classList.add("table_photo");
    const imgPhoto = document.createElement("img");
    imgPhoto.style = "width: 63px; border-radius: 50px;";
    imgPhoto.setAttribute(
      "src",
      `${
        user.profile_image_url
          ? user.profile_image_url
          : "../renderer/images/author-2.jpg"
      }`
    );
    imgPhoto.setAttribute("alt", "user-photo");
    divPhoto.appendChild(imgPhoto);
    photoElement.appendChild(divPhoto);
    row.appendChild(photoElement);

    const usernameElement = document.createElement("td");
    usernameElement.classList.add("title");

    const divUsername = document.createElement("div");
    divUsername.classList.add("table_category");
    const hUsername = document.createElement("h6");
    hUsername.textContent = user.username;
    divUsername.append(hUsername);
    usernameElement.appendChild(divUsername);
    row.appendChild(usernameElement);

    const userEmailElement = document.createElement("td");
    userEmailElement.classList.add("category");

    const divUserEmail = document.createElement("div");
    divUserEmail.classList.add("table_title");
    const pUserEmail = document.createElement("p");
    pUserEmail.textContent = `${
      user.UserLoginDatum?.email_addr ?? "Email não encontrado"
    }`;
    divUserEmail.appendChild(pUserEmail);
    userEmailElement.appendChild(divUserEmail);
    row.appendChild(userEmailElement);

    const promoElement = document.createElement("td");
    promoElement.classList.add("category");
    promoElement.style = "text-align: center";

    const divPromo = document.createElement("div");
    divPromo.classList.add("table_title");
    const spanPromo = document.createElement("span");
    spanPromo.classList.add(`${user.user_id}`);

    spanPromo.setAttribute("title", "user-id");
    spanPromo.textContent = promoCounter;
    divPromo.appendChild(spanPromo);
    promoElement.appendChild(divPromo);
    row.appendChild(promoElement);

    const actionsElement = document.createElement("td");
    actionsElement.classList.add("action");

    const divAction = document.createElement("div");
    divAction.classList.add("table_action");
    const ulAction = document.createElement("ul");
    const liActionFirst = document.createElement("li");
    const aActionFirst = document.createElement("a");
    aActionFirst.style.cursor = "pointer";
    const editAction = document.createElement("i");
    editAction.classList.add("fal", "fa-pencil");
    aActionFirst.append(editAction);
    liActionFirst.append(aActionFirst);
    const liActionSecond = document.createElement("li");
    const aActionSecond = document.createElement("a");
    aActionSecond.setAttribute("data-userid", `${user.user_id}`);
    aActionSecond.classList.add("delete-user");
    const deleteAction = document.createElement("i");
    aActionSecond.style.cursor = "pointer";
    deleteAction.classList.add("fal", "fa-trash-alt");
    aActionSecond.append(deleteAction);
    liActionSecond.append(aActionSecond);
    ulAction.append(liActionFirst, liActionSecond);
    divAction.append(ulAction);
    actionsElement.appendChild(divAction);
    row.appendChild(actionsElement);

    tableBody.appendChild(row);

    aActionSecond.addEventListener("click", deleteUser);
  });
}

function main() {
  showAllUsers();
  inactiveUsersBtn.addEventListener("click", () =>
    renderUsers(totalUsers, userStatus.isInactive)
  );
  activeUsersBtn.addEventListener("click", () =>
    renderUsers(totalUsers, userStatus.isActive)
  );
}

window.addEventListener("load", main);
