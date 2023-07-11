const socket = io();

const formProducts = document.getElementById('form-products');
const inputTitle = document.getElementById('form-title');
const inputDescript = document.getElementById('form-description');
const inputPrice = document.getElementById('form-price');
const inputCode = document.getElementById('form-code');
const inputStock = document.getElementById('form-stock');
const inputCategory = document.getElementById('form-category');
const inputThumbnails = document.getElementById('form-thumbnails');
const chatForm = document.getElementById('chat-form');
const textInput = document.getElementById('text-input');
const user = document.getElementById('user-input');

// Escuchando servidor
socket.on('products', (products) => {
  // Como lo habia solucionado pt.1
  // renderProducts(products);

  // Como se solicitó segun lo entendido en en el after

  //Usado en para FileSystem
  // <td><button type="button" class="btn btn-danger " onclick="deleteProduct(${product.id})">X</button></td>

  const productList = document.querySelector('.productListUpdated');
  productList.innerHTML = `
    ${products
      .map(
        (product) => `
      <tr>
        <th scope="row">${product.id}</th>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td><img src="${product.thumbnails}" alt="${product.id}" title="Foto de ${product.title}" style="width: 50px; min-height: 100%; max-height: 50px;"></td>
        <td><button type="button" class="btn btn-danger" onclick="deleteProduct('${product.id}')">X</button></td>
      </tr>
    `
      )
      .join('')}
  `;
});

// Como lo habia solucionado pt.2
/*
const renderProducts = (products) => {
  fetch("/realTimeProducts")
    .then((result) => result.text())
    .then((serverTemplate) => {
      const template = Handlebars.compile(serverTemplate);
      const html = template({ products });
      document.getElementById("productList").innerHTML = html;
    });
};
*/
if (formProducts) {
  formProducts.onsubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      title: inputTitle.value,
      description: inputDescript.value,
      price: +inputPrice.value,
      thumbnails: [inputThumbnails.value],
      code: inputCode.value,
      stock: +inputStock.value,
      category: inputCategory.value,
    };
    socket.emit('new-product', newProduct);
    formProducts.reset();
  };
}

deleteProduct = (productId) => {
  // socket.emit("delete-product", productId); // Usado para FyleSystem
  socket.emit('delete-product', productId.toString());
};

// Chat Section
if (chatForm) {
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const msg = {
      user: user.value,
      message: textInput.value,
    };
    socket.emit('new-message', msg);
    textInput.value = '';
  };
}

socket.on('chat-message', (data) => {
  renderAllMessages(data);
});

const renderAllMessages = (data) => {
  const html = data
    .map((elem) => {
      let fragment = `

          <div class="messages">
              <span><b>${elem.user}</b></span><br />
              <span>${elem.message}</span>
          </div>
     `;
      return fragment;
    })
    .join('\n');
  document.getElementById('divChat').innerHTML = html;
};
