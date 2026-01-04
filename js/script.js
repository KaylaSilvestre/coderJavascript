document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  //  CARRITO SIDEBAR
  // ===============================
  const btnCarrito = document.getElementById("btn-carrito");
  const sidebar = document.getElementById("carrito-sidebar");
  const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");

  function abrirCarrito() {
    sidebar.classList.add("activo");
  }

  function cerrarCarrito() {
    sidebar.classList.remove("activo");
  }

  btnCarrito?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirCarrito();
  });

  btnCerrarCarrito?.addEventListener("click", cerrarCarrito);

  // ===============================
  //  PRODUCTOS BASE
  //  (dejé una sola img por producto y corregí el producto 8)
  // ===============================
  const productos = [
    { id: 1, nombre: "Mates personalizados", precio: 600, img: "../assets/img/producto mate.jpg" },
    { id: 2, nombre: "Llaveros personalizados", precio: 50, img: "../assets/img/producto llavero.jpg" },
    { id: 3, nombre: "Pantallas MDF", precio: 1650, img: "../assets/img/producto pantalla.jpg" },
    { id: 4, nombre: "Stickers personalizados", precio: 150, img: "../assets/img/producto sticker.jpg" },

    { id: 5, nombre: "Placas personalizadas", precio: 300, img: "../assets/img/producto dije.jpg" },
    { id: 6, nombre: "Vaso térmico", precio: 550, img: "../assets/img/producto vaso.jpg" },
    { id: 7, nombre: "Souvenirs personalizados", precio: 45, img: "../assets/img/producto souvenir.jpg" },
    { id: 8, nombre: "Caja para té", precio: 450, img: "../assets/img/producto caja te.jpg" },

    { id: 9, nombre: "Souvenirs", precio: 0, img: "../assets/img/producto souvenir.jpg" },
    { id: 10, nombre: "Placa para mascotas", precio: 0, img: "../assets/img/producto dije.jpg" },
  ];

  // ===============================
  //  ESTADO CARRITO + LOCALSTORAGE
  // ===============================
  let carrito = [];
  let cuponActivo = false;
  let descuentoAplicado = 0;
  let envio = 0;

  const LS_KEY = "carrito";
  const LS_KEY_CUPON = "cuponActivo";

  function guardarCarrito() {
    localStorage.setItem(LS_KEY, JSON.stringify(carrito));
    localStorage.setItem(LS_KEY_CUPON, JSON.stringify(cuponActivo));
  }

  function cargarCarrito() {
    const guardado = localStorage.getItem(LS_KEY);
    const cuponGuardado = localStorage.getItem(LS_KEY_CUPON);

    if (guardado) {
      try {
        carrito = JSON.parse(guardado);
      } catch (e) {
        carrito = [];
      }
    } else {
      carrito = [];
    }

    if (cuponGuardado !== null) {
      try {
        cuponActivo = JSON.parse(cuponGuardado);
      } catch (e) {
        cuponActivo = false;
      }
    } else {
      cuponActivo = false;
    }
  }

  // ===============================
  //  REFS DOM
  // ===============================
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

  // ===============================
  //  AGREGAR AL CARRITO
  // ===============================
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
    actualizarContadorCarrito();
  }

  // ===============================
  //  MOSTRAR CARRITO
  // ===============================
  function mostrarCarrito() {
    if (!listaCarrito || !textoCarritoVacio) return;

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
    actualizarContadorCarrito();
  }

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
        actualizarContadorCarrito();
      });
    });
  }

  function activarBotonesEliminar() {
    document.querySelectorAll(".carrito-item-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        carrito = carrito.filter((p) => p.id !== id);
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorCarrito();
      });
    });
  }

  // ===============================
  //  TOTALES (igual que tu lógica)
  // ===============================
  function actualizarTotales() {
    if (!spanSubtotal || !spanDescuento || !spanEnvio || !spanTotal) return;

    const subtotal = carrito.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );

    if (cuponActivo && subtotal > 0) {
      descuentoAplicado = subtotal * 0.15;
    } else {
      descuentoAplicado = 0;
    }

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

  // ===============================
  //  CUPÓN
  // ===============================
  formCupon?.addEventListener("submit", (e) => {
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
      guardarCarrito();
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

    guardarCarrito();
    actualizarTotales();
  });

  // Vaciar carrito
  btnVaciarCarrito?.addEventListener("click", () => {
    carrito = [];
    cuponActivo = false;
    if (inputCupon) inputCupon.value = "";
    if (mensajeCupon) mensajeCupon.textContent = "";
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
  });

  // Quitar cupón
  btnQuitarCupon?.addEventListener("click", () => {
    cuponActivo = false;
    if (inputCupon) inputCupon.value = "";
    if (mensajeCupon) {
      mensajeCupon.textContent = "Cupón eliminado.";
      mensajeCupon.style.color = "#b02a37";
    }
    guardarCarrito();
    actualizarTotales();
  });

  // ===============================
  //  BOTONES AGREGAR
  // ===============================
  const botonesAgregar = document.querySelectorAll(".btn-agregar");
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      agregarAlCarrito(id);
    });
  });

  // ===============================
  //  FINALIZAR COMPRA → CHECKOUT
  // ===============================
  document.getElementById("btn-checkout")?.addEventListener("click", (e) => {
  e.preventDefault();

  const carritoLS = JSON.parse(localStorage.getItem("carrito")) || [];
  if (!carritoLS.length) {
    alert("Tu carrito está vacío 🙂");
    return;
  }

  // ✅ ruta absoluta: funciona desde cualquier página
  window.location.href = "/checkout.html";
});


  // ===============================
  //  INICIALIZACIÓN
  // ===============================
  cargarCarrito();
  mostrarCarrito();
  actualizarContadorCarrito();

  // ===============================
  //  POPUP ANIMACIÓN (tu código)
  // ===============================
  window.addEventListener("load", () => {
    const popupText = document.querySelector(".popup p");
    if (!popupText) return;

    let x = window.innerWidth * 0.4;
    const velocidad = 4;

    function moverTexto() {
      x -= velocidad;

      if (x < -popupText.offsetWidth) {
        x = window.innerWidth * 0.5;
      }

      popupText.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(moverTexto);
    }

    moverTexto();
  });

  // ===============================
  //  FAVORITOS (tu código intacto)
  // ===============================
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.map(f => typeof f === "object" ? f.id : f);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  actualizarContadorFavoritos();

  const popupFav = document.getElementById("popup-favoritos");
  const listaFav = document.getElementById("lista-favoritos");
  const btnCerrarFav = document.getElementById("cerrar-popup-fav");
  const btnFavHeader = document.getElementById("btn-favoritos-header");

  function actualizarIconosFavoritos() {
    document.querySelectorAll(".card-producto").forEach(card => {
      const id = card.dataset.id;
      const icon = card.querySelector(".btn-favorito i");
      if (!icon) return;

      if (favoritos.includes(id)) icon.classList.add("favorito-activo");
      else icon.classList.remove("favorito-activo");
    });
  }

  function abrirPopupFavoritos() {
    if (!popupFav || !listaFav) return;

    listaFav.innerHTML = "";

    if (favoritos.length === 0) {
      listaFav.innerHTML = `<li class="fav-empty">Aún no has agregado productos a favoritos.</li>`;
      popupFav.style.display = "flex";
      return;
    }

    favoritos.forEach(id => {
      const card = document.querySelector(`.card-producto[data-id="${id}"]`);
      if (card) {
        const titulo = card.querySelector("h3").innerText;
        const img = card.querySelector("img").src;
        const desc = card.querySelector("p")?.innerText || "";
        const precio = card.querySelector(".precio")?.innerText || "";

        listaFav.innerHTML += `
          <li class="item-favorito">
            <div class="fav-img"><img src="${img}" alt="${titulo}"></div>
            <div class="fav-info">
              <h3>${titulo}</h3>
              <p>${desc}</p>
              <span class="fav-precio">${precio}</span>
            </div>
            <div class="fav-actions">
              <button class="btn-fav-add" data-id="${id}">
                <i class="fa fa-shopping-cart"></i><span>Add</span>
              </button>
              <button class="btn-fav-remove" data-id="${id}">
                <i class="fa fa-trash"></i><span>Remove</span>
              </button>
            </div>
          </li>
        `;
      }
    });

    if (!listaFav.innerHTML.trim()) {
      listaFav.innerHTML = `<li class="fav-empty">Aún no has agregado productos a favoritos.</li>`;
    }

    popupFav.style.display = "flex";
    activarBotonesFavoritos();
  }

  function activarBotonesFavoritos() {
    document.querySelectorAll(".btn-fav-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        favoritos = favoritos.filter(f => f !== id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        actualizarIconosFavoritos();
        abrirPopupFavoritos();
        actualizarContadorFavoritos();
      });
    });

    document.querySelectorAll(".btn-fav-add").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        agregarAlCarrito(id);
        abrirCarrito();
      });
    });
  }

  function cerrarPopupFavoritos() {
    if (!popupFav) return;
    popupFav.style.display = "none";
  }

  btnCerrarFav?.addEventListener("click", cerrarPopupFavoritos);

  btnFavHeader?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirPopupFavoritos();
  });

  document.querySelectorAll(".btn-favorito").forEach(boton => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".card-producto");
      if (!card) return;

      const id = card.dataset.id;

      if (favoritos.includes(id)) favoritos = favoritos.filter(f => f !== id);
      else favoritos.push(id);

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      actualizarIconosFavoritos();
      abrirPopupFavoritos();
      actualizarContadorFavoritos();
    });
  });

  actualizarIconosFavoritos();

  function actualizarContadorFavoritos() {
    favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const favCount = document.getElementById("favoritos-count");
    if (!favCount) return;

    if (favoritos.length === 0) favCount.style.display = "none";
    else {
      favCount.style.display = "inline-block";
      favCount.innerText = favoritos.length;
    }
  }

  function actualizarContadorCarrito() {
    const cartCount = document.getElementById("carrito-count");
    if (!cartCount) return;

    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.innerText = total;
    cartCount.style.display = total > 0 ? "inline-block" : "none";
  }

  // ===============================
  //  CHAT FLOTANTE (tu código)
  // ===============================
  const chatFab = document.getElementById("chat-fab");
  const chatBox = document.getElementById("chat-box");
  const chatClose = document.getElementById("chat-close");
  const chatBody = document.getElementById("chat-body");

  chatFab?.addEventListener("click", () => {
    if (chatBox.style.display === "flex") chatBox.style.display = "none";
    else chatBox.style.display = "flex";
  });

  chatClose?.addEventListener("click", () => {
    chatBox.style.display = "none";
  });

  function agregarMensajeBot(text) {
    chatBody.innerHTML += `
      <div class="chat-row bot">
        <div class="chat-icon"><i class="fa-solid fa-ellipsis"></i></div>
        <div class="chat-bubble">${text}</div>
      </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function agregarMensajeUsuario(text) {
    chatBody.innerHTML += `
      <div class="chat-row user">
        <div class="chat-bubble" style="background:#2E4C3A; color:#DDE6D5; margin-left:auto;">
          ${text}
        </div>
      </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function cargarOpcionesPrincipales() {
    const footer = document.querySelector(".chat-footer");

    footer.innerHTML = `
      <button class="chat-option">Pedidos</button>
      <button class="chat-option">Envíos</button>
      <button class="chat-option">Métodos de pago</button>
      <button class="chat-option">Otro</button>
    `;

    activarOpcionesPrincipales();
  }

  function activarOpcionesPrincipales() {
    document.querySelectorAll(".chat-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const opcion = btn.innerText.trim();
        agregarMensajeUsuario(opcion);

        const footer = document.querySelector(".chat-footer");

        if (opcion === "Pedidos") {
          agregarMensajeBot("Claro, elegí una opción 👇");

          footer.innerHTML = `
            <button class="sub-option">◀ Volver</button>
            <button class="sub-option">¿Cuánto demora mi pedido?</button>
            <button class="sub-option">¿Cómo va mi pedido?</button>
            <button class="sub-option">Horario de entrega</button>
          `;

          activarSubOpciones();
          return;
        }

        if (opcion === "Envíos") {
          agregarMensajeBot(
            "Realizamos envíos a todo el país 🚚. " +
            "El envío dentro de Montevideo cuesta $150 y se coordina con el cliente una vez finalizado y pronto para entregar el pedido. Si la compra es mayor a $1500 tenés envío gratis!!!" +
            "Los envíos fuera de Montevideo se realizan por agencia y es a elección del cliente."
          );
          return;
        }

        if (opcion === "Métodos de pago") {
          agregarMensajeBot(
            "Aceptamos transferencia bancaria, MercadoPago y efectivo. " +
            "También podemos coordinar otros métodos según disponibilidad."
          );
          return;
        }

        if (opcion === "Otro") {
          agregarMensajeBot("Podés contarnos por Whatsapp qué necesitás y te ayudaremos lo antes posible. 😊");
          return;
        }
      });
    });
  }

  function activarSubOpciones() {
    document.querySelectorAll(".sub-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const pregunta = btn.innerText.trim();
        agregarMensajeUsuario(pregunta);

        if (pregunta === "◀ Volver") {
          agregarMensajeBot("Claro, ¿en qué más puedo ayudarte? 😊");
          cargarOpcionesPrincipales();
          return;
        }

        if (pregunta === "¿Cuánto demora mi pedido?") {
          agregarMensajeBot(
            "Los pedidos personalizados tienen demora dependiendo del producto y de la cantidad. " +
            "Comunícate con nosotros por Whatsapp y te informamos la demora exacta de tu pedido. 😊"
          );
        }

        if (pregunta === "¿Cómo va mi pedido?") {
          agregarMensajeBot("Podemos revisarlo por vos. Envíanos tu nombre o número de pedido. 💬");
        }

        if (pregunta === "Horario de entrega") {
          agregarMensajeBot(
            "Las entregas se realizan entre las 10:00 y las 19:00. " +
            "Coordinamos horario exacto por WhatsApp."
          );
        }
      });
    });
  }

  activarOpcionesPrincipales();

});




