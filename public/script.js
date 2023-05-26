const catalog = document.getElementById('catalog');
async function fetchData() {
    try {
        const response = await fetch("http://localhost:1337/api/laptops?fields=title&fields=price&populate[Image][fields]=url");
        if (response.ok) {
            const json = await response.json();
            console.log(json.data);
            insertItems(json);
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}
fetchData();

function insertItems(json) {
    for (let i = 0; i < json.data.length; i++) {
        catalog.insertAdjacentHTML("beforeEnd",
            `<div class="catalog__item">
        <a href=""><img class="catalog-item__img" src="${'http://localhost:1337' + json.data[i].attributes.Image.data[0].attributes.url}" alt="Laptop"></a>
        <a href="">
            <h2 class="catalog-item__title">${json.data[i].attributes.Title}</h2>
        </a>
        <p class="catalog-item__price">${json.data[i].attributes.Price}</p>
        </div>`);
    }
}