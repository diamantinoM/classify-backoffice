import { buildAdInfo, setApprovingEvent } from "./ad-handler.js";
import { showMessage } from "./utils/message-box.js";
import { getWithAuth, deleteWithAuth } from "./utils/fetch.js";
import {
  createElementWithClass,
  createElementWithAttr,
  createElementWithContent,
  createGenericElement,
} from "./utils/build-elements.js";

const inactiveAdsBtn = document.getElementById("inactive_ads");
const activeAdsBtn = document.getElementById("active_ads");
const pActive = document.getElementById("p_active");
const pInactive = document.getElementById("p_inactive");
let totalAds = [];
const adStatus = { active: 1, inactive: 2 };

async function fetchAdData({ currentTarget }) {
  const adId = currentTarget.dataset.adid;

  try {
    const response = await getWithAuth(`https://api.classify.pt/ads/${adId}`);
    const { ad } = await response.json();
    buildAdInfo(ad);
  } catch (err) {
    console.error(err);
  }
}

async function showAllAds() {
  try {
    const response = await getWithAuth("https://api.classify.pt/ads");
    const { ads } = await response.json();
    totalAds = ads;

    const inactiveAds = ads.filter((ad) => ad.status_id === adStatus.inactive);
    if (!inactiveAds.length) {
      return renderAds(ads, adStatus.active);
    }
    return renderAds(ads, adStatus.inactive);
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
    const response = await deleteWithAuth(`https://api.classify.pt/ads/${adId}`);
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

function renderAds(adsData, statusAds) {
  const ads = adsData.filter((ad) => ad.status_id === statusAds); // ad_status_id
  const activeAds = adsData.filter((ad) => ad.status_id === adStatus.active);
  const inactiveAds = adsData.filter(
    (ad) => ad.status_id === adStatus.inactive
  );

  pInactive.textContent = `${inactiveAds.length} Anúncios`;
  pActive.textContent = `${activeAds.length} Anúncios`;

  const tableBody = document.querySelector(".ads_table tbody");
  tableBody.innerHTML = "";

  ads.forEach((ad) => {
    const row = document.createElement("tr");

    const checkboxElement = createElementWithClass("td", ["checkbox"]);
    const divCheckBox = createElementWithClass("div", ["table_checkbox"]);
    const inputCheckBox = createElementWithAttr("input", {
      type: "checkbox",
      id: `checkbox${ad.id}`,
    });
    const labelCheckBox = createElementWithAttr("label", {
      for: `checkbox${ad.id}`,
    });
    divCheckBox.append(inputCheckBox, labelCheckBox);
    checkboxElement.appendChild(divCheckBox);
    row.appendChild(checkboxElement);

    const photoElement = createElementWithClass("td", ["photo"]);

    const divPhoto = createElementWithClass("div", ["table_photo"]);
    const imgPhoto = createElementWithAttr("img", {
      src: `${ad.AdImages[0].image_path_url}`,
      alt: `${ad.AdImages[0].image_name}`,
    });
    divPhoto.appendChild(imgPhoto);
    photoElement.appendChild(divPhoto);
    row.appendChild(photoElement);

    const titleElement = createElementWithClass("td", ["title"]);

    const divTitle = createElementWithClass("div", ["table_title"]);
    const hTitle = createElementWithContent("h6", ad.title);
    const pTitle = createElementWithContent("p", `Ad ID: ${ad.id}`);
    divTitle.append(hTitle, pTitle);
    titleElement.appendChild(divTitle);
    row.appendChild(titleElement);

    const subCategoryElement = createElementWithClass("td", ["category"]);
    const divSubCategory = createElementWithClass("div", ["table_category"]);
    const pSubCategory = createElementWithContent(
      "p",
      ad.subcategory.subcategory_name
    );
    divSubCategory.appendChild(pSubCategory);
    subCategoryElement.appendChild(divSubCategory);
    row.appendChild(subCategoryElement);

    const statusElement = createElementWithClass("td", ["category"]);

    const divStatus = createElementWithClass("div", ["table_status"]);
    const spanStatus = createGenericElement(
      "span",
      [ad.status.status_name_internal],
      { title: ad.status.status_description },
      ad.status.status_name
    );
    divStatus.appendChild(spanStatus);
    statusElement.appendChild(divStatus);
    row.appendChild(statusElement);

    const priceElement = document.createElement("td");
    priceElement.classList.add("price");

    const divPrice = createElementWithClass("div", ["table_price"]);
    const spanPrice = createElementWithContent(
      "span",
      `${prettyPrice(ad.price)}€`
    );
    divPrice.appendChild(spanPrice);
    priceElement.appendChild(divPrice);
    row.appendChild(priceElement);

    const actionsElement = createElementWithClass("td", ["action"]);

    const divAction = createElementWithClass("div", ["table_action"]);
    const ulAction = document.createElement("ul");
    const liActionFirst = document.createElement("li");
    const aActionFirst = createElementWithAttr("a", {
      "data-toggle": "modal",
      "data-target": "#exampleModal",
      "data-adid": ad.id,
    });
    aActionFirst.addEventListener("click", fetchAdData);
    aActionFirst.style.cursor = "pointer";
    const editAction = createElementWithClass("i", ["fal", "fa-eye"]);
    aActionFirst.append(editAction);
    liActionFirst.append(aActionFirst);
    const liActionSecond = document.createElement("li");
    const aActionSecond = createGenericElement("a", ["delete-ad"], {
      "data-adid": ad.id,
    });
    const deleteAction = createElementWithClass("i", ["fal", "fa-trash-alt"]);
    aActionSecond.style.cursor = "pointer";
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
