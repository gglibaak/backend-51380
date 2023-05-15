const socket = io();

const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCategory = document.getElementById("form-category");
const inputThumbnail = document.getElementById("form-thumbnail");

// // Escuchando servidor
socket.on("products", (data) => {
  renderProducts(data);
});

const renderProducts = (products) => {
  fetch("/realTimeProducts")
    .then((result) => result.text())
    .then((serverTemplate) => {
      const template = Handlebars.compile(serverTemplate);
      const html = template({ products });
      document.getElementById("productList").innerHTML = html;
    });
};

formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: inputTitle.value,
    description: inputDescript.value,
    price: +inputPrice.value,
    thumbnail: inputThumbnail.value,
    code: inputCode.value,
    stock: +inputStock.value,
    category: inputCategory.value,
  };
  socket.emit("new-product", newProduct);
});
