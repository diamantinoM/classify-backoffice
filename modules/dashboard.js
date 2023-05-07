import { buildAdInfo, setApprovingEvent } from "./ad-handler.js";
import { showErrorMessage, showMessage } from "./utils/message-box.js";

const token = window.sessionStorage.getItem("token");
const inactiveAdsBtn = document.getElementById("inactive_ads");
const activeAdsBtn = document.getElementById("active_ads");
const pActive = document.getElementById("p_active");
const pInactive = document.getElementById("p_inactive");
let totalAds = [];
const adStatus = { active: 1, inactive: 2 };

async function fetchAdData({ currentTarget }) {
  const adId = currentTarget.dataset.adid;

  try {
    const response = await fetch(`http://localhost:3000/ads/${adId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    const { ad } = await response.json();
    buildAdInfo(ad);
  } catch (err) {
    console.error(err);
  }
}

async function showAllAds() {
  try {
    const response = await fetch("http://localhost:3000/ads", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    const data = await response.json();
    totalAds = data;

    const inactiveAds = data.ads.filter(
      (ad) => ad.status_id === adStatus.inactive
    );
    if (inactiveAds.length === 0) {
      renderAds(data, adStatus.active);
    } else {
      renderAds(data, adStatus.inactive);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteAd({ currentTarget }) {
  const adId = currentTarget.dataset.adid;
  const infoBox = await showMessage(
    "info",
    "Tem certeza que deseja excluir este anúncio?",
    ["Sim", "Cancelar"],
    "Eliminar Anúncio",
    { cancelId: 1 }
  );
  if (infoBox.response === 1) {
    return;
  }
  try {
    const response = await fetch(`http://localhost:3000/ads/${adId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return await showErrorMessage("Algo está errado! Reinicie a aplicação.");
    }
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

function renderAds(data, statusAds) {
  const allAds = data.ads;
  const ads = allAds.filter((ad) => ad.status_id === statusAds); // ad_status_id
  const activeAds = allAds.filter((ad) => ad.status_id === adStatus.active);
  const inactiveAds = allAds.filter((ad) => ad.status_id === adStatus.inactive);

  pInactive.textContent = `${inactiveAds.length} Anúncios`;
  pActive.textContent = `${activeAds.length} Anúncios`;

  const tableBody = document.querySelector(".ads_table tbody");
  tableBody.innerHTML = "";

  ads.forEach((ad) => {
    const row = document.createElement("tr");

    const checkboxElement = document.createElement("td");
    checkboxElement.classList.add("checkbox");

    const divCheckBox = document.createElement("div");
    divCheckBox.classList.add("table_checkbox");
    const inputCheckBox = document.createElement("input");
    inputCheckBox.setAttribute("type", "checkbox");
    inputCheckBox.setAttribute("id", `checkbox${ad.id}`);
    const labelCheckBox = document.createElement("label");
    labelCheckBox.setAttribute("for", `checkbox${ad.id}`);
    divCheckBox.append(inputCheckBox, labelCheckBox);
    checkboxElement.appendChild(divCheckBox);
    row.appendChild(checkboxElement);

    const photoElement = document.createElement("td");
    photoElement.classList.add("photo");

    const divPhoto = document.createElement("div");
    divPhoto.classList.add("table_photo");
    const imgPhoto = document.createElement("img");
    imgPhoto.setAttribute("src", `${ad.AdImages[0].image_path_url}`);
    imgPhoto.setAttribute("alt", `${ad.AdImages[0].image_name}`);
    divPhoto.appendChild(imgPhoto);
    photoElement.appendChild(divPhoto);
    row.appendChild(photoElement);

    const titleElement = document.createElement("td");
    titleElement.classList.add("title");

    const divTitle = document.createElement("div");
    divTitle.classList.add("table_title");
    const hTitle = document.createElement("h6");
    hTitle.textContent = ad.title;
    const pTitle = document.createElement("p");
    pTitle.textContent = `Ad ID: ${ad.id}`;
    divTitle.append(hTitle, pTitle);
    titleElement.appendChild(divTitle);
    row.appendChild(titleElement);

    const subCategoryElement = document.createElement("td");
    subCategoryElement.classList.add("category");

    const divSubCategory = document.createElement("div");
    divSubCategory.classList.add("table_category");
    const pSubCategory = document.createElement("p");
    pSubCategory.textContent = `${ad.subcategory.subcategory_name}`;
    divSubCategory.appendChild(pSubCategory);
    subCategoryElement.appendChild(divSubCategory);
    row.appendChild(subCategoryElement);

    const statusElement = document.createElement("td");
    statusElement.classList.add("category");

    const divStatus = document.createElement("div");
    divStatus.classList.add("table_status");
    const spanStatus = document.createElement("span");
    spanStatus.classList.add(`${ad.status.status_name_internal}`);

    spanStatus.setAttribute("title", `${ad.status.status_description}`);
    spanStatus.textContent = ad.status.status_name;
    divStatus.appendChild(spanStatus);
    statusElement.appendChild(divStatus);
    row.appendChild(statusElement);

    const priceElement = document.createElement("td");
    priceElement.classList.add("price");

    const divPrice = document.createElement("div");
    divPrice.classList.add("table_price");
    const spanPrice = document.createElement("span");
    spanPrice.textContent = `${prettyPrice(ad.price)}€`;
    prettyPrice(ad.price);
    divPrice.appendChild(spanPrice);
    priceElement.appendChild(divPrice);
    row.appendChild(priceElement);

    const actionsElement = document.createElement("td");
    actionsElement.classList.add("action");

    const divAction = document.createElement("div");
    divAction.classList.add("table_action");
    const ulAction = document.createElement("ul");
    const liActionFirst = document.createElement("li");
    const aActionFirst = document.createElement("a");
    aActionFirst.style.cursor = "pointer";
    aActionFirst.setAttribute("data-toggle", "modal");
    aActionFirst.setAttribute("data-target", "#exampleModal");
    aActionFirst.setAttribute("data-adid", `${ad.id}`);
    aActionFirst.addEventListener("click", fetchAdData);
    const editAction = document.createElement("i");
    editAction.classList.add("fal", "fa-eye");
    aActionFirst.append(editAction);
    liActionFirst.append(aActionFirst);
    const liActionSecond = document.createElement("li");
    const aActionSecond = document.createElement("a");
    aActionSecond.setAttribute("data-adid", `${ad.id}`);
    aActionSecond.classList.add("delete-ad");
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

    aActionSecond.addEventListener("click", deleteAd);
  });
}

function prettyPrice(price) {
  const tempPrice = `${price}`.split(".");
  return tempPrice.length > 1
    ? tempPrice.join(".")
    : Number(tempPrice[0]).toFixed(2);
}

function main() {
  showAllAds();
  inactiveAdsBtn.addEventListener("click", () =>
    renderAds(totalAds, adStatus.inactive)
  );
  activeAdsBtn.addEventListener("click", () =>
    renderAds(totalAds, adStatus.active)
  );
  setApprovingEvent();
}

window.addEventListener("load", main);
