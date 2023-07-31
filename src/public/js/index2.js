/*const verCartLink = document.querySelector(".cart-link");
if (verCartLink) {
  let cartLSid = JSON.parse(localStorage.getItem("cart-id"));
  verCartLink.href = `http://localhost:8080/carts/${cartLSid}`;
}

const AddtoCart = (id) => {
  if (!localStorage.getItem("cart-id")) {
    console.log("No existe el cart en localStorage");
    fetch("http://localhost:8080/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("cart-id", JSON.stringify(data.payload._id));
        AddtoCart(id);
        verCartLink.href = `http://localhost:8080/carts/${data.payload._id}`;
      })
      .catch((err) => console.log(err));
  } else {
    const cartId = JSON.parse(localStorage.getItem("cart-id"));
    fetch(`http://localhost:8080/api/carts/${cartId}/products/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(
          `Producto con el id: ${id} se agregó al cart con id: ${data.payload._id}`
        );
        showMsg(`🛒 Producto agregado al carro con el id: ${id}.`);
      })
      .catch((err) => console.log(err));
  }
};
const showMsg = (msg) => {
  Toastify({
    text: msg,
    duration: 3000,
    stopOnFocus: true,
    style: {
      background: "#96c93d",
    },
  }).showToast();
};

//Cart Section
const deleteCartItems = (id) => {
  fetch(`http://localhost:8080/api/carts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`Cart con el id: ${id} se eliminó`);
      localStorage.removeItem("cart-id");
      setTimeout(() => {
        window.location.href = window.location.href; //refresh modo vikingo
      }, 3000);
      showMsg(
        `🎉 Producto adquirido con éxito. CartId: ${id}. El carrito se vaciará`
      );
    })
    .catch((err) => console.log(err));
};
*/

// ############ 2da version ############
const cartInfoElement = document.getElementsByClassName('cartInfo')[0];

const AddtoCart = (id) => {
  const cartIdValue = cartInfoElement?.getAttribute('id');
  if (cartIdValue === undefined) {
    window.location.href = '/auth/login';
  }

  fetch(`/api/carts/${cartIdValue}/products/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`Producto con el id: ${id} se agregó al cart con id: ${cartIdValue}`);
      showMsg(`🛒 Producto agregado al carro con el id: ${id}.`);
    })
    .catch((err) => console.log(err));
};

const showMsg = (msg) => {
  Toastify({
    text: msg,
    duration: 3000,
    stopOnFocus: true,
    style: {
      background: '#96c93d',
    },
    offset: {
      x: 2,
      y: 65,
    },
  }).showToast();
};

//Cart Section
const deleteCartItems = (cartId) => {
  fetch(`/api/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        window.location.href = window.location.href; //refresh modo vikingo
      }, 3000);
      showMsg(`⚠ El carrito se vaciará, CartId: ${cartId}.`);
    })
    .catch((err) => console.log(err));
};

const purchaseCart = (cartId) => {
  //get cartId from fetch
  fetch(`/api/carts/${cartId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.payload.products);
      const products = data.payload.products;
      const formatProduct = products.map((product) => {
        return {
          id: product.id._id,
          quantity: product.quantity,
        };
      });
      // console.log('desde front', formatProduct);

      fetch(`/api/carts/${cartId}/purchase`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formatProduct),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);

          setTimeout(() => {
            window.location.href = window.location.href; //refresh modo vikingo
          }, 3000);
          showMsg(
            `🎉 Productos adquiridos con éxito. CartId: ${cartId}. El carrito se vaciará solo con los productos con stock disponible.`
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
