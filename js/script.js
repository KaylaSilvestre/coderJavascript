// Siderbar carrito
const btnCarrito = document.getElementById("btn-carrito");
const sidebar = document.getElementById("carrito-sidebar");
const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");

function abrirCarrito() {
  sidebar.classList.add("activo");
}

function cerrarCarrito() {
  sidebar.classList.remove("activo");
}

btnCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  abrirCarrito();
});

btnCerrarCarrito.addEventListener("click", cerrarCarrito);

// Productos base
const productos = [
  {
    id: 1,
    nombre: "Mate personalizado",
    precio: 600,
    img: "./assets/img/producto mate.jpg",
  },
  {
    id: 2,
    nombre: "Souvenir personalizado",
    precio: 45,
    img: "./assets/img/producto souvenir.jpg",
  },
  {
    id: 3,
    nombre: "Pantalla MDF",
    precio: 1650,
    img: "./assets/img/producto pantalla.jpg",
  },
  {
    id: 4,
    nombre: "Stickers personalizados",
    precio: 150,
    img: "./assets/img/producto sticker.jpg",
  },
];

// Estado del carrito
let carrito = [];
let cuponActivo = false; // true si el cupon está aplicado
let descuentoAplicado = 0;
let envio = 0;

const LS_KEY = "carrito";

function guardarCarrito() {
  localStorage.setItem(LS_KEY, JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem(LS_KEY);
  if (guardado) {
    try {
      carrito = JSON.parse(guardado);
    } catch (e) {
      carrito = [];
    }
  } else {
    carrito = [];
  }
}

// Ref del dom
const listaCarrito = document.getElementById("lista-carrito");
const textoCarritoVacio = document.getElementById("carrito-vacio");

const spanSubtotal = document.getElementById("subtotal");
const spanDescuento = document.getElementById("descuento");
const spanEnvio = document.getElementById("envio");
const spanTotal = document.getElementById("total");

const formCupon = document.getElementById("form-cupon");
const inputCupon = document.getElementById("input-cupon");
const mensajeCupon = document.getElementById("mensaje-cupon");

const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnQuitarCupon = document.getElementById("btn-quitar-cupon");
const btnCheckout = document.getElementById("btn-checkout");

// Agregar producto por id
function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  let item = carrito.find((p) => p.id === idProducto);

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  mostrarCarrito();
  abrirCarrito();
}

// Mostrar carrito en el HTML
function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    textoCarritoVacio.style.display = "block";
    actualizarTotales();
    return;
  }

  textoCarritoVacio.style.display = "none";

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("carrito-item");

    li.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}">
      <div class="carrito-item-info">
        <h4>${item.nombre}</h4>
        <span>$${item.precio}</span>

        <div class="carrito-cantidad">
          <button class="btn-restar" data-id="${item.id}">-</button>
          <span>${item.cantidad}</span>
          <button class="btn-sumar" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="carrito-item-delete" data-id="${item.id}">✕</button>
    `;

    listaCarrito.appendChild(li);
  });

  activarBotonesCantidad();
  activarBotonesEliminar();
  actualizarTotales();
}

// Botones cantidades items
function activarBotonesCantidad() {
  document.querySelectorAll(".btn-sumar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      let item = carrito.find((p) => p.id === id);
      if (!item) return;
      item.cantidad++;
      guardarCarrito();
      mostrarCarrito();
    });
  });

  document.querySelectorAll(".btn-restar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      let item = carrito.find((p) => p.id === id);
      if (!item) return;

      if (item.cantidad > 1) {
        item.cantidad--;
      } else {
        carrito = carrito.filter((p) => p.id !== id);
      }
      guardarCarrito();
      mostrarCarrito();
    });
  });
}

// Botón eliminar
function activarBotonesEliminar() {
  document.querySelectorAll(".carrito-item-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      carrito = carrito.filter((p) => p.id !== id);
      guardarCarrito();
      mostrarCarrito();
    });
  });
}

// Calcular y mostrar totales
function actualizarTotales() {
  const subtotal = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );

  // Descuento 15% si el cupón está activo
  if (cuponActivo && subtotal > 0) {
    descuentoAplicado = subtotal * 0.15;
  } else {
    descuentoAplicado = 0;
  }

  // Envio
  if (subtotal === 0) {
    envio = 0;
  } else if (subtotal - descuentoAplicado >= 1500) {
    envio = 0;
  } else {
    envio = 150;
  }

  const total = subtotal - descuentoAplicado + envio;

  spanSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  spanDescuento.textContent =
    descuentoAplicado > 0 ? `-$${descuentoAplicado.toFixed(2)}` : "$0";
  spanEnvio.textContent = envio === 0 ? "GRATIS" : `$${envio.toFixed(2)}`;
  spanTotal.textContent = `$${total.toFixed(2)}`;
}

// Cupon 15%
formCupon.addEventListener("submit", (e) => {
  e.preventDefault();

  const codigo = inputCupon.value.trim().toUpperCase();
  const subtotal = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );

  if (subtotal === 0) {
    mensajeCupon.textContent = "Agregá productos antes de aplicar el cupón.";
    mensajeCupon.style.color = "#b02a37";
    cuponActivo = false;
    actualizarTotales();
    return;
  }

  if (codigo === "PRIMERA15") {
    cuponActivo = true;
    mensajeCupon.textContent = "¡Cupón aplicado! 15% OFF 🎉";
    mensajeCupon.style.color = "#2E4C3F";
  } else {
    cuponActivo = false;
    mensajeCupon.textContent = "Cupón inválido ❌";
    mensajeCupon.style.color = "#b02a37";
  }

  actualizarTotales();
});

// Vaciar carrito
btnVaciarCarrito.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
});

// Boton quitar cupon
btnQuitarCupon.addEventListener("click", () => {
  cuponActivo = false;
  inputCupon.value = "";
  mensajeCupon.textContent = "Cupón eliminado.";
  mensajeCupon.style.color = "#b02a37";
  actualizarTotales();
});

// Botones agregar al carrito
const botonesAgregar = document.querySelectorAll(".btn-agregar");

botonesAgregar.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = parseInt(btn.dataset.id);
    agregarAlCarrito(id);
  });
});

// Finalizar compra
if (btnCheckout) {
  btnCheckout.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío 🛒");
      return;
    }
    alert(
      "Simulacion de compra finalizada"
    );
  });
}

// Inicializacion
cargarCarrito();
mostrarCarrito();

// Animacion popup
window.addEventListener("load", () => {
  const popupText = document.querySelector(".popup p");
  if (!popupText) return;

  let x = window.innerWidth * 0.4;
  const velocidad = 4;

  function moverTexto() {
    x -= velocidad;

    if (x < -popupText.offsetWidth) {
      x = window.innerWidth * 0.5; //
    }

    popupText.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(moverTexto);
  }

  moverTexto();
});


