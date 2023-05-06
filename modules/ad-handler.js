import { showErrorMessage } from "./utils/message-box.js";

const modalTitle = document.querySelector(".modal-title");
const modalAdImage = document.querySelector(".ads_card_image img");
const modelAdSubcategory = document.getElementById("ad-subcategory");
const modalAdTitle = document.querySelector(".single_ads_card .title a");
const modelAdDescription = document.getElementById("ad-description");
const modalAdPrice = document.querySelector(".single_ads_card .price");
const modelApproveAdBtn = document.getElementById("approve-btn");
const modalAdLocation = document.getElementById("ad-location");

const APPROVED_STATUS = 1;
const token = window.sessionStorage.getItem("token");

async function approveAd({ currentTarget }) {
  const adId = currentTarget.dataset.adid;

  try {
    const response = await fetch(`http://localhost:3000/ads/${adId}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status_id: APPROVED_STATUS,
      }),
    });
    if (!response.ok) {
      return await showErrorMessage();
    }
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

export function buildAdInfo(ad) {
  const isApprovedAd = ad.status_id === APPROVED_STATUS;
  modelApproveAdBtn.style.visibility = isApprovedAd ? "hidden" : "visible";
  modalTitle.textContent = ad.title;
  const [mainAdImage] = ad.AdImages;
  modalAdImage.src = mainAdImage.image_path_url;
  modelAdSubcategory.textContent = ad.subcategory.subcategory_name;
  modalAdTitle.textContent = ad.title;
  modelAdDescription.textContent = ad.description;
  modalAdLocation.innerHTML = `<i class="fal fa-map-marker-alt"></i> 
  ${ad.ad_address.country}, ${ad.ad_address.city}`;
  modalAdPrice.textContent = `${ad.price}€`;
  modelApproveAdBtn.setAttribute("data-adid", ad.id);
}

export function setApprovingEvent() {
  modelApproveAdBtn.addEventListener("click", approveAd);
}
