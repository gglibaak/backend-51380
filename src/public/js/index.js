const socket = io();


const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCategory = document.getElementById("form-category");
const inputThumbnail = document.getElementById("form-thumbnail");

// Escuchando servidor

socket.on("products", (data) => {
    renderProducts(data);
  });

  // Función para renderizar los productos con Handlebars
//   const renderProducts = (products) => {
//     fetch("/realTimeProducts")
//       .then((result) => result.text())
//       .then((template) => {

//         const compiledTemplate = Handlebars.compile(template);
//         const html = compiledTemplate({ products });
//         document.getElementById("productList").innerHTML = html;
//       })
//       .catch((error) => {
//         console.error("Error al cargar la plantilla:", error);
//       });
//   };

const renderProducts = (products) => {
    const productList = document.getElementById("productList");

    // Crear un nuevo div temporal para almacenar los nuevos productos
    const tempDiv = document.createElement("div");

    // Renderizar los nuevos productos en el div temporal usando la plantilla preconfigurada
    const template = Handlebars.templates.realTimeProducts;
    const html = template({ products });
    tempDiv.innerHTML = html;

    // Copiar los nuevos productos al DOM
    const newProductList = tempDiv.querySelector("#productList");
    productList.parentNode.replaceChild(newProductList, productList);
  };



formProducts.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
        title: inputTitle.value,
        description: inputDescript.value,
        price: +(inputPrice.value),
        thumbnail: inputThumbnail.value,
        code: inputCode.value,
        stock: +(inputStock.value),
        category: inputCategory.value
    };
    socket.emit("new-product", newProduct);
});
