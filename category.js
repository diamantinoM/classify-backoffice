const token = window.sessionStorage.getItem('token');
const pCategories = document.getElementById('p_num_categories');
const pSubcategories = document.getElementById('p_num_subcategories');

async function showAllCategories() {
    try{
        const response = await fetch('http://localhost:3000/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorBox = await window.versions.dialog(
                {type: 'error',
                message: 'Algo está errado! Reinicie a aplicação.',
                buttons: ['Continuar'],
                title: 'Classify',
                icon: './renderer/images/classify-logo.png',
                detail: 'Em caso deste erro persistir, entre em contato com o administrador.'
            });
            return errorBox;
        }
        const data = await response.json();
        renderCategories(data);
    }catch (err){
        console.error(err);
    }
}

function renderCategories(data) {
    const allCategories = data.categories;
    const totalCategories = allCategories.length;
    let totalSubcategories = 0;
    pCategories.innerText = `${totalCategories} Categorias`;

    const accordion = document.getElementById('accordionExample');
    accordion.innerHTML = '';

    allCategories.forEach((category) => {
        totalSubcategories += category.Subcategories.length;
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        cardHeader.setAttribute('id', `heading${category.id}`);
        const aCardHeader = document.createElement('a');
        aCardHeader.classList.add('collapsed');
        aCardHeader.style = 'padding: 15px 30px; cursor: pointer;';
        aCardHeader.setAttribute('data-toggle', 'collapse');
        aCardHeader.setAttribute('data-target', `#collapse${category.id}`);
        aCardHeader.setAttribute('aria-expanded', 'false');
        aCardHeader.setAttribute('aria-controls', `collapse${category.id}`);
        aCardHeader.innerText = category.category_name;
        cardHeader.append(aCardHeader);
        
        const collapseSubcategory = document.createElement('div');
        collapseSubcategory.setAttribute('id', `collapse${category.id}`);
        collapseSubcategory.classList.add('collapse');
        collapseSubcategory.setAttribute('aria-labelledby', `heading${category.id}`);
        collapseSubcategory.setAttribute('data-parent', '#accordionExample');
        const subcategoryCardBody = document.createElement('div');
        subcategoryCardBody.classList.add('card-body');
        const ulSubcategory = document.createElement('ul');
        ulSubcategory.style = `display: grid; margin-left: 1rem;
        grid-template-columns: repeat(3, 1fr); gap: 10px;`;

        category.Subcategories.forEach((subcategory) => {
            const liSubcategory = document.createElement('li');
            liSubcategory.style = `display: flex;
            align-items: center;
            justify-content: space-between;`;
            const spanSubcategory = document.createElement('span');
            spanSubcategory.style.fontSize = '19px;';
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
}

window.addEventListener('load', main);