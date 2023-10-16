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
      if (data.status === 'error') {
        showMsg2(`${data.error} - El producto con el id: ${id} no puede ser agregado.`, 1000, '#f74020');
        return;
      }
      // console.log(`Producto con el id: ${id} se agregó al cart con id: ${cartIdValue}`);
      showMsg(`🛒 Producto agregado al carro con el id: ${id}.`, 3000);
    })
    .catch((err) => {
      // console.log(err);
      showMsg2(`⚠ El producto con el id: ${id} no puede ser agregado.`, 1000, '#f74020');
    });
};

const showMsg = (msg, duration) => {
  Toastify({
    text: `${msg} - Cerrando en ${Math.ceil(duration / 1000)} segundos`,
    duration,
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

const showMsg2 = (msg, duration, color) => {
  let remainingTime = duration;

  const updateTimer = () => {
    remainingTime -= 1000;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      toast.hideToast();
    } else {
      toast = Toastify({
        text: `${msg} - Cerrando en ${Math.ceil(remainingTime / 1000)} segundos`,
        duration,
        stopOnFocus: true,
        style: {
          background: color,
        },
        offset: {
          x: 2,
          y: 65,
        },
      });
      toast.showToast();
    }
  };

  let toast = Toastify({
    text: `${msg} - Cerrando en ${Math.ceil(remainingTime / 1000)} segundos`,
    duration,
    stopOnFocus: true,
    style: {
      background: color,
    },
    offset: {
      x: 2,
      y: 65,
    },
  });

  const timerInterval = setInterval(updateTimer, 1000);

  toast.showToast();
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
      showMsg2(`⚠ El carrito se vaciará, CartId: ${cartId}.`, 3000, '#ff3352');
    })
    .catch((err) => console.log(err));
};

const purchaseCart = (cartId) => {
  fetch(`/api/carts/${cartId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const products = data.payload.products;
      const formatProduct = products.map((product) => {
        return {
          id: product.id._id,
          quantity: product.quantity,
        };
      });

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
          const id = data.payload._id;
          setTimeout(() => {
            window.location.href = `/api/carts/purchase/${id}`;
          }, 3000);
          showMsg2(
            `🎉 Estamos procesando tu compra!. El carrito se vaciará solo con los productos con stock disponible.`,
            3000,
            '##0D6EFD'
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
const role = document.getElementById('role');
//TODO ARREGLAR ESTO
function changeRoleOnClick(id, admin = false) {
  fetch(`/api/users/premium/${id}?api=true&admin=${admin}`)
    .then((response) => response.json())
    .then((data) => {
      if (data === 'premium') {
        role.classList.add('text-success');
        role.classList.remove('text-info');
        role.classList.remove('text-danger');
        data = 'Usuario Premium';
      } else if (data === 'user') {
        role.classList.add('text-info');
        role.classList.remove('text-success');
        role.classList.remove('text-danger');
        data = 'Usuario Standard';
      } else if (data === 'admin') {
        role.classList.add('text-danger');
        role.classList.remove('text-info');
        role.classList.remove('text-success');
        data = 'Usuario Administrador';
      }

      role.innerHTML = data;

      showMsg(`✔️ El usuario a cambiado a ${data}.`, 2000);
    })
    .catch((error) => console.error('Error:', error));
}

deleteUser = (id, checkAllusers = false) => {
  fetch(`/api/users/${id}?checkall=${checkAllusers}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      checkAllusers === true
        ? showMsg2(`✔️ Todos los usuarios inactivos seran eliminados.`, 2000, '#ff3352')
        : showMsg2(`✔️ El usuario con el id: ${id} ha sido eliminado.`, 2000, '#ff3352');
    })
    .catch((error) => console.error('Error:', error));
};
