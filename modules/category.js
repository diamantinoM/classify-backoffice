import { showErrorMessage, showMessage } from "./utils/message-box.js";
import {
  deleteWithAuth,
  getWithAuth,
  postWithAuth,
  updateWithAuth,
} from "./utils/fetch.js";

const pCategories = document.getElementById("p_num_categories");
const pSubcategories = document.getElementById("p_num_subcategories");
const titleCategory = document.getElementById("category_title");
const titleSubcategory = document.getElementById("subcategory_title");
let data;

const BASE_URL_CATEGORIES = "https://api.classify.pt/categories";
const BASE_URL_SUBCATEGORIES = "https://api.classify.pt/subcategories";

async function showAllCategories() {
  try {
    const response = await getWithAuth(`${BASE_URL_CATEGORIES}`);
    data = await response.json();
    renderCategories(data);
  } catch (err) {
    console.error(err);
  }
}
//DELETE
async function deleteSubcategory({ currentTarget }) {
  const subcategoryId = currentTarget.dataset.subcategoryid;
  const infoBox = await showMessage(
    "info",
    "Tem certeza que deseja excluir esta Subcategoria?",
    ["Sim", "Cancelar"],
    "Eliminar Subcategoria",
    { cancelId: 1 }
  );
  if (infoBox.response === 1) {
    return;
  }
  try {
    const response = await deleteWithAuth(
      `${BASE_URL_SUBCATEGORIES}/${subcategoryId}`
    );
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

async function deleteCategory({ currentTarget }) {
  const categoryId = currentTarget.dataset.categoryid;
  const infoBox = await showMessage(
    "info",
    "Tem certeza que deseja excluir esta Categoria?",
    ["Sim", "Cancelar"],
    "Eliminar Categoria",
    { cancelId: 1 }
  );
  if (infoBox.response === 1) {
    return;
  }
  try {
    const response = await deleteWithAuth(
      `${BASE_URL_CATEGORIES}/${categoryId}`
    );
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}
//EDIT
async function editCategory({ currentTarget }) {
  const categoryId = currentTarget.dataset.categoryid;
  const categoryName = currentTarget.dataset.categoryname;

  const divTable = document.getElementById("categories_table");
  divTable.classList.remove("table");
  divTable.style.width = "100%";
  divTable.innerHTML = "";

  const divForm = document.createElement("div");
  const form = document.createElement("form");
  form.setAttribute("method", "PUT");
  form.setAttribute("action", `${BASE_URL_CATEGORIES}`);
  const formDiv = document.createElement("div");
  const postFormDiv = document.createElement("div");
  postFormDiv.className = "post_form";
  form.append(formDiv);

  const formTitle = document.createElement("div");
  formTitle.classList.add("post_title");
  const hTitle = document.createElement("h5");
  hTitle.classList.add("title");
  hTitle.innerText = "Editar Categoria";
  formTitle.appendChild(hTitle);

  const divCategoryNameInput = document.createElement("div");
  divCategoryNameInput.classList.add("single_form");
  const categoryNameInput = document.createElement("input");
  categoryNameInput.setAttribute("type", "text");
  categoryNameInput.setAttribute("name", "category_name");
  categoryNameInput.value = categoryName;
  divCategoryNameInput.appendChild(categoryNameInput);

  const divSubmitBtn = document.createElement("div");
  divSubmitBtn.classList.add("single_form");
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("main-btn");
  submitBtn.innerHTML = "Confirmar Alterações";
  divSubmitBtn.appendChild(submitBtn);

  const divBackBtn = document.createElement("div");
  divBackBtn.classList.add("single_form");
  const backBtn = document.createElement("button");
  backBtn.classList.add("main-btn");
  backBtn.style.backgroundColor = "#42424294";
  backBtn.innerHTML = "Voltar";
  divBackBtn.appendChild(backBtn);

  postFormDiv.append(formTitle, divCategoryNameInput, divSubmitBtn, divBackBtn);
  formDiv.appendChild(postFormDiv);
  form.append(formDiv);
  divForm.appendChild(form);
  divTable.appendChild(divForm);
  backBtn.addEventListener("click", async () => {
    renderModal(data, "category");
  });
  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const categoryName = categoryNameInput.value;
    try {
      const response = await updateWithAuth(
        `${BASE_URL_CATEGORIES}/${categoryId}`,
        "PUT",
        { category_name: categoryName }
      );
      response.ok &&
        (await showMessage(
          "none",
          "Categoria editada com sucesso!",
          ["Continuar"],
          "Categoria"
        ));
      return window.location.reload();
    } catch (err) {
      console.error(err);
    }
  });
}

async function editSubcategory({ currentTarget }) {
  const subcategoryId = currentTarget.dataset.subcategoryid;
  const subcategoryName = currentTarget.dataset.subcategoryname;

  const divTable = document.getElementById("subcategories_table");
  divTable.classList.remove("table");
  divTable.style.width = "100%";
  divTable.innerHTML = "";

  const divForm = document.createElement("div");
  const form = document.createElement("form");
  form.setAttribute("method", "PUT");
  form.setAttribute("action", `${BASE_URL_SUBCATEGORIES}`);
  const formDiv = document.createElement("div");
  const postFormDiv = document.createElement("div");
  postFormDiv.className = "post_form";
  form.append(formDiv);

  const formTitle = document.createElement("div");
  formTitle.classList.add("post_title");
  const hTitle = document.createElement("h5");
  hTitle.classList.add("title");
  hTitle.innerText = "Editar Categoria";
  formTitle.appendChild(hTitle);

  const divSubcategoryNameInput = document.createElement("div");
  divSubcategoryNameInput.classList.add("single_form");
  const subcategoryNameInput = document.createElement("input");
  subcategoryNameInput.setAttribute("type", "text");
  subcategoryNameInput.setAttribute("name", "category_name");
  subcategoryNameInput.value = subcategoryName;
  divSubcategoryNameInput.appendChild(subcategoryNameInput);

  const divSubmitBtn = document.createElement("div");
  divSubmitBtn.classList.add("single_form");
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("main-btn");
  submitBtn.innerHTML = "Confirmar Alterações";
  divSubmitBtn.appendChild(submitBtn);

  const divBackBtn = document.createElement("div");
  divBackBtn.classList.add("single_form");
  const backBtn = document.createElement("button");
  backBtn.classList.add("main-btn");
  backBtn.style.backgroundColor = "#42424294";
  backBtn.innerHTML = "Voltar";
  divBackBtn.appendChild(backBtn);

  postFormDiv.append(
    formTitle,
    divSubcategoryNameInput,
    divSubmitBtn,
    divBackBtn
  );
  formDiv.appendChild(postFormDiv);
  form.append(formDiv);
  divForm.appendChild(form);
  divTable.appendChild(divForm);
  backBtn.addEventListener("click", async () => {
    renderModal(data, "subcategory");
  });
  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const subcategoryName = subcategoryNameInput.value;
    try {
      const response = await updateWithAuth(
        `${BASE_URL_SUBCATEGORIES}/${subcategoryId}`,
        "PUT",
        { subcategory_name: subcategoryName }
      );
      response.ok &&
        (await showMessage(
          "none",
          "Subcategoria editada com sucesso!",
          ["Continuar"],
          "Subcategoria"
        ));
      return window.location.reload();
    } catch (err) {
      console.error(err);
    }
  });
}

//CREATE
function createCategory() {
  const divTable = document.getElementById("categories_table");
  divTable.classList.remove("table");
  divTable.style.width = "100%";
  divTable.innerHTML = "";

  const divForm = document.createElement("div");
  const form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", `${BASE_URL_CATEGORIES}`);
  const formDiv = document.createElement("div");
  const postFormDiv = document.createElement("div");
  postFormDiv.className = "post_form";
  form.append(formDiv);

  const formTitle = document.createElement("div");
  formTitle.classList.add("post_title");
  const hTitle = document.createElement("h5");
  hTitle.classList.add("title");
  hTitle.innerText = "Nova Categoria";
  formTitle.appendChild(hTitle);

  const divCategoryNameInput = document.createElement("div");
  divCategoryNameInput.classList.add("single_form");
  const categoryNameInput = document.createElement("input");
  categoryNameInput.setAttribute("type", "text");
  categoryNameInput.setAttribute("name", "category_name");
  categoryNameInput.setAttribute("placeholder", "Nome da Categoria");
  divCategoryNameInput.appendChild(categoryNameInput);

  const divCategoryIconInput = document.createElement("div");
  divCategoryIconInput.classList.add("single_form");
  const categoryIconInput = document.createElement("input");
  categoryIconInput.setAttribute("type", "text");
  categoryIconInput.setAttribute("name", "category_icon");
  categoryIconInput.setAttribute(
    "placeholder",
    "FontAwesome exemplo: fal fa-wrench"
  );
  divCategoryIconInput.appendChild(categoryIconInput);

  const divSubmitBtn = document.createElement("div");
  divSubmitBtn.classList.add("single_form");
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("main-btn");
  submitBtn.innerHTML = "Criar";
  divSubmitBtn.appendChild(submitBtn);

  postFormDiv.append(
    formTitle,
    divCategoryNameInput,
    divCategoryIconInput,
    divSubmitBtn
  );
  formDiv.appendChild(postFormDiv);
  form.append(formDiv);
  divForm.appendChild(form);
  divTable.appendChild(divForm);

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const categoryName = categoryNameInput.value;
    const categoryIcon = categoryIconInput.value;
    try {
      const response = await postWithAuth(`${BASE_URL_CATEGORIES}`, {
        category_name: categoryName,
        category_icon: categoryIcon,
      });
      response.ok &&
        (await showMessage(
          "none",
          "Categoria criada com sucesso!",
          ["Continuar"],
          "Categoria"
        ));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  });
}

function createSubcategory() {
  const divTable = document.getElementById("subcategories_table");
  divTable.classList.remove("table");
  divTable.style.width = "100%";
  divTable.innerHTML = "";

  const divForm = document.createElement("div");
  const form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", `${BASE_URL_SUBCATEGORIES}`);
  const formDiv = document.createElement("div");
  const postFormDiv = document.createElement("div");
  postFormDiv.className = "post_form";

  form.append(formDiv);

  const formTitle = document.createElement("div");
  formTitle.classList.add("post_title");
  const hTitle = document.createElement("h5");
  hTitle.classList.add("title");
  hTitle.innerText = "Nova Subcategoria";
  formTitle.appendChild(hTitle);

  const divSubcategoryNameInput = document.createElement("div");
  divSubcategoryNameInput.classList.add("single_form");
  const subcategoryNameInput = document.createElement("input");
  subcategoryNameInput.setAttribute("type", "text");
  subcategoryNameInput.setAttribute("name", "subcategory_name");
  subcategoryNameInput.setAttribute("placeholder", "Nome da Subcategoria");
  divSubcategoryNameInput.appendChild(subcategoryNameInput);

  const divCategoryIdInput = document.createElement("div");
  divCategoryIdInput.classList.add("single_form");
  const categoryIdInput = document.createElement("input");
  categoryIdInput.setAttribute("type", "text");
  categoryIdInput.setAttribute("name", "category_id");
  categoryIdInput.setAttribute("placeholder", "Id Categoria a ser adicionada");
  divCategoryIdInput.appendChild(categoryIdInput);

  const divSubmitBtn = document.createElement("div");
  divSubmitBtn.classList.add("single_form");
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("main-btn");
  submitBtn.innerHTML = "Criar";
  divSubmitBtn.appendChild(submitBtn);

  postFormDiv.append(
    formTitle,
    divSubcategoryNameInput,
    divCategoryIdInput,
    divSubmitBtn
  );
  formDiv.appendChild(postFormDiv);
  form.append(formDiv);
  divForm.appendChild(form);
  divTable.appendChild(divForm);
  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const subcategoryName = subcategoryNameInput.value;
    const categoryId = categoryIdInput.value;
    try {
      const response = await postWithAuth(`${BASE_URL_SUBCATEGORIES}`, {
        subcategory_name: subcategoryName,
        category_id: categoryId,
      });
      response.ok &&
        (await showMessage(
          "none",
          "Subcategoria criada com sucesso!",
          ["Continuar"],
          "Categoria"
        ));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  });
}
//MODAL
function renderModal(data, option) {
  const allCategories = data.categories;

  const modalContent = document.getElementById("modal_content");
  modalContent.innerHTML = "";

  if (option !== "subcategory") {
    const divCreate = document.createElement("div");
    divCreate.classList.add("col-sm-4");
    const divSingleCreate = document.createElement("div");
    divSingleCreate.className = "single_dashboard_box d-flex";

    const divIcon = document.createElement("div");
    divIcon.classList.add("box_icon");
    const aIcon = document.createElement("a");
    aIcon.style.cursor = "pointer";
    const iIcon = document.createElement("i");
    iIcon.className = "fal fa-plus";
    aIcon.appendChild(iIcon);
    divIcon.appendChild(aIcon);
    const divTextCreate = document.createElement("div");
    divTextCreate.className = "box_content media-body";
    divTextCreate.style = "padding-top: 0.7rem; padding-left: 1rem;";
    const h6Create = document.createElement("h6");
    h6Create.classList.add("title");
    const aCreate = document.createElement("a");
    aCreate.setAttribute("id", "create_category");
    aCreate.style.cursor = "pointer";
    aCreate.innerText = "Criar Categoria";
    h6Create.appendChild(aCreate);
    divTextCreate.appendChild(h6Create);
    divSingleCreate.append(divIcon, divTextCreate);
    divCreate.appendChild(divSingleCreate);

    const divTable = document.createElement("div");
    divTable.className = "ads_table table-responsive mt-30";
    divTable.style = "overflow-y: scroll; height: 30rem;";
    const table = document.createElement("table");
    table.id = "categories_table";
    table.classList.add("table");
    const head = document.createElement("thead");
    const row = document.createElement("tr");
    const thIcon = document.createElement("th");
    thIcon.classList.add("title");
    thIcon.innerText = "Ícone";
    const thTitle = document.createElement("th");
    thTitle.classList.add("title");
    thTitle.innerText = "Título";
    const thAction = document.createElement("th");
    thAction.classList.add("action");
    thAction.innerHTML = "Ação";
    const body = document.createElement("tbody");
    body.setAttribute("id", "table_body");
    divTable.appendChild(table);
    table.append(head, body);
    head.appendChild(row);
    row.append(thIcon, thTitle, thAction);

    modalContent.append(divCreate, divTable);

    divSingleCreate.addEventListener("click", createCategory);

    allCategories.forEach((category) => {
      const row = document.createElement("tr");
      const tdIcon = document.createElement("td");
      tdIcon.classList.add("photo");
      const categoryIcon = document.createElement("i");
      categoryIcon.style = "font-size: 2.6rem; color: #ff4367";
      categoryIcon.className = `${category.category_icon}`;
      tdIcon.appendChild(categoryIcon);

      const tdTitle = document.createElement("td");
      tdTitle.classList.add("title");
      const divTitle = document.createElement("div");
      divTitle.classList.add("table_title");
      const h6Title = document.createElement("h6");
      h6Title.classList.add("titles");
      h6Title.innerText = `${category.category_name}`;
      divTitle.appendChild(h6Title);
      tdTitle.appendChild(divTitle);
      const tdAction = document.createElement("td");
      tdAction.classList.add("action");
      const divAction = document.createElement("div");
      divAction.classList.add("table_action");

      const ulAction = document.createElement("ul");
      const liDeleteAction = document.createElement("li");
      const aDeleteAction = document.createElement("a");
      aDeleteAction.setAttribute("data-categoryid", `${category.id}`);
      aDeleteAction.style.cursor = "pointer";
      const iDeleteAction = document.createElement("i");
      iDeleteAction.className = "fal fa-trash-alt";
      liDeleteAction.appendChild(aDeleteAction);
      aDeleteAction.appendChild(iDeleteAction);

      const liEditAction = document.createElement("li");
      const aEditAction = document.createElement("a");
      aEditAction.setAttribute("data-categoryid", `${category.id}`);
      aEditAction.setAttribute(
        "data-categoryname",
        `${category.category_name}`
      );
      aEditAction.style.cursor = "pointer";
      const iEditAction = document.createElement("i");
      iEditAction.className = "fal fa-pencil";
      liEditAction.appendChild(aEditAction);
      aEditAction.appendChild(iEditAction);
      ulAction.append(liEditAction, liDeleteAction);
      divAction.appendChild(ulAction);
      tdAction.appendChild(divAction);
      row.append(tdIcon, tdTitle, tdAction);
      body.appendChild(row);

      aEditAction.addEventListener("click", editCategory);
      aDeleteAction.addEventListener("click", deleteCategory);
    });
  }
  if (option === "subcategory") {
    const divCreate = document.createElement("div");
    divCreate.classList.add("col-sm-4");
    const divSingleCreate = document.createElement("div");
    divSingleCreate.className = "single_dashboard_box d-flex";

    const divIcon = document.createElement("div");
    divIcon.classList.add("box_icon");
    const aIcon = document.createElement("a");
    aIcon.style.cursor = "pointer";
    const iIcon = document.createElement("i");
    iIcon.className = "fal fa-plus";
    aIcon.appendChild(iIcon);
    divIcon.appendChild(aIcon);
    const divTextCreate = document.createElement("div");
    divTextCreate.className = "box_content media-body";
    divTextCreate.style = "padding-top: 0.7rem; padding-left: 1rem;";
    const h6Create = document.createElement("h6");
    h6Create.classList.add("title");
    const aCreate = document.createElement("a");
    aCreate.setAttribute("id", "create_subcategory");
    aCreate.style.cursor = "pointer";
    aCreate.innerText = "Criar Subcategoria";
    h6Create.appendChild(aCreate);
    divTextCreate.appendChild(h6Create);
    divSingleCreate.append(divIcon, divTextCreate);
    divCreate.appendChild(divSingleCreate);

    const divTable = document.createElement("div");
    divTable.className = "ads_table table-responsive mt-30";
    divTable.style = "overflow-y: scroll; height: 30rem;";
    const table = document.createElement("table");
    table.id = "subcategories_table";
    table.classList.add("table");
    const head = document.createElement("thead");
    const row = document.createElement("tr");
    const thIcon = document.createElement("th");
    thIcon.classList.add("title");
    thIcon.innerText = "Ícone";
    const thTitle = document.createElement("th");
    thTitle.classList.add("title");
    thTitle.innerText = "Título";
    const thAction = document.createElement("th");
    thAction.classList.add("action");
    thAction.innerHTML = "Ação";
    const body = document.createElement("tbody");
    body.setAttribute("id", "table_body");
    divTable.appendChild(table);
    table.append(head, body);
    head.appendChild(row);
    row.append(thIcon, thTitle, thAction);

    modalContent.append(divCreate, divTable);

    divSingleCreate.addEventListener("click", createSubcategory);
    allCategories.forEach((category) => {
      category.Subcategories.forEach((subcategory) => {
        const row = document.createElement("tr");
        const tdIcon = document.createElement("td");
        tdIcon.classList.add("photo");
        const categoryIcon = document.createElement("i");
        categoryIcon.style = "font-size: 2.6rem; color: #ff4367";
        categoryIcon.className = `${category.category_icon}`;
        tdIcon.appendChild(categoryIcon);

        const tdTitle = document.createElement("td");
        tdTitle.classList.add("title");
        const divTitle = document.createElement("div");
        divTitle.classList.add("table_title");
        const h6Title = document.createElement("h6");
        h6Title.classList.add("titles");
        h6Title.innerText = `${subcategory.subcategory_name}`;
        divTitle.appendChild(h6Title);
        tdTitle.appendChild(divTitle);
        const tdAction = document.createElement("td");
        tdAction.classList.add("action");
        const divAction = document.createElement("div");
        divAction.classList.add("table_action");

        const ulAction = document.createElement("ul");
        const liDeleteAction = document.createElement("li");
        const aDeleteAction = document.createElement("a");
        aDeleteAction.setAttribute("data-subcategoryid", `${subcategory.id}`);
        aDeleteAction.style.cursor = "pointer";
        const iDeleteAction = document.createElement("i");
        iDeleteAction.className = "fal fa-trash-alt";
        liDeleteAction.appendChild(aDeleteAction);
        aDeleteAction.appendChild(iDeleteAction);

        const liEditAction = document.createElement("li");
        const aEditAction = document.createElement("a");
        aEditAction.setAttribute("data-subcategoryid", `${subcategory.id}`);
        aEditAction.setAttribute(
          "data-subcategoryname",
          `${subcategory.subcategory_name}`
        );
        aEditAction.style.cursor = "pointer";
        const iEditAction = document.createElement("i");
        iEditAction.className = "fal fa-pencil";
        liEditAction.appendChild(aEditAction);
        aEditAction.appendChild(iEditAction);
        ulAction.append(liEditAction, liDeleteAction);
        divAction.appendChild(ulAction);
        tdAction.appendChild(divAction);
        row.append(tdIcon, tdTitle, tdAction);
        body.appendChild(row);

        aEditAction.addEventListener("click", editSubcategory);
        aDeleteAction.addEventListener("click", deleteSubcategory);
      });
    });
  }
}

function renderCategories(data) {
  const allCategories = data.categories;
  const totalCategories = allCategories.length;
  let totalSubcategories = 0;
  pCategories.innerText = `${totalCategories} Categorias`;

  const accordion = document.getElementById("accordionExample");
  accordion.innerHTML = "";

  allCategories.forEach((category) => {
    totalSubcategories += category.Subcategories.length;
    const categoryCard = document.createElement("div");
    categoryCard.classList.add("card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.setAttribute("id", `heading${category.id}`);
    const aCardHeader = document.createElement("a");
    aCardHeader.classList.add("collapsed");
    aCardHeader.style = "padding: 15px 30px; cursor: pointer;";
    aCardHeader.setAttribute("data-toggle", "collapse");
    aCardHeader.setAttribute("data-target", `#collapse${category.id}`);
    aCardHeader.setAttribute("aria-expanded", "false");
    aCardHeader.setAttribute("aria-controls", `collapse${category.id}`);
    aCardHeader.innerText = category.category_name;
    cardHeader.append(aCardHeader);

    const collapseSubcategory = document.createElement("div");
    collapseSubcategory.setAttribute("id", `collapse${category.id}`);
    collapseSubcategory.classList.add("collapse");
    collapseSubcategory.setAttribute(
      "aria-labelledby",
      `heading${category.id}`
    );
    collapseSubcategory.setAttribute("data-parent", "#accordionExample");
    const subcategoryCardBody = document.createElement("div");
    subcategoryCardBody.classList.add("card-body");
    const ulSubcategory = document.createElement("ul");
    ulSubcategory.style = `display: grid; margin-left: 1rem;
        grid-template-columns: repeat(3, 1fr); gap: 10px;`;

    category.Subcategories.forEach((subcategory) => {
      const liSubcategory = document.createElement("li");
      liSubcategory.style = `display: flex;
            align-items: center;
            justify-content: space-between;`;
      const spanSubcategory = document.createElement("span");
      spanSubcategory.style.fontSize = "19px;";
      spanSubcategory.innerHTML = `<i class="${category.category_icon}"
            style="margin-right: 0.4rem; color: #ff4367;"></i>${subcategory.subcategory_name}`;
      liSubcategory.append(spanSubcategory);
      ulSubcategory.appendChild(liSubcategory);
      subcategoryCardBody.appendChild(ulSubcategory);
      collapseSubcategory.appendChild(subcategoryCardBody);
    });
    categoryCard.append(cardHeader, collapseSubcategory);
    accordion.append(categoryCard);
  });
  pSubcategories.innerText = `${totalSubcategories} Subcategorias`;
}
function main() {
  showAllCategories();
  titleCategory.addEventListener("click", () => {
    renderModal(data, "category");
  });
  titleSubcategory.addEventListener("click", () => {
    renderModal(data, "subcategory");
  });
}

window.addEventListener("load", main);
