document.addEventListener("DOMContentLoaded", () => {
  initCheckoutPage();
});

function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  if (!form) return; // no estamos en checkout

  const LS_KEY = "carrito";
  const LS_KEY_CUPON = "cuponActivo";
  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbwqxIZE9aJOhvYdAr_g7siTbBIwls6aJoA7SQICOhAcLgTNnryyj7K2M-qxULYzEYGC0g/exec";

  // ===============================
  // Helpers
  // ===============================
  const getCarrito = () =>
    JSON.parse(localStorage.getItem(LS_KEY)) || [];

  const getCuponActivo = () =>
    JSON.parse(localStorage.getItem(LS_KEY_CUPON)) || false;

  const calcularTotales = (carrito, cuponActivo) => {
    const subtotal = carrito.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    const descuento =
      cuponActivo && subtotal > 0 ? subtotal * 0.15 : 0;

    let envio = 0;
    if (subtotal === 0) envio = 0;
    else if (subtotal - descuento >= 1500) envio = 0;
    else envio = 150;

    const total = subtotal - descuento + envio;
    return { subtotal, descuento, envio, total };
  };

  const generarIdOrden = () => {
    const f = new Date();
    const y = f.getFullYear();
    const m = String(f.getMonth() + 1).padStart(2, "0");
    const d = String(f.getDate()).padStart(2, "0");
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `HPM-${y}${m}${d}-${rand}`;
  };

  // ===============================
  // DOM refs
  // ===============================
  const itemsBox = document.getElementById("items");
  const rSub = document.getElementById("r-subtotal");
  const rDesc = document.getElementById("r-descuento");
  const rEnv = document.getElementById("r-envio");
  const rTot = document.getElementById("r-total");
  const rCupon = document.getElementById("r-cupon");

  const errorBox = document.getElementById("error");
  const btnConfirmar = document.getElementById("btn-confirmar");

  const pagoInfo = document.getElementById("pago-info");
  const extraInfo = document.getElementById("extra-info");

  // ===============================
  // Render resumen
  // ===============================
  const carrito = getCarrito();
  const cuponActivo = getCuponActivo();

  if (!carrito.length) {
    itemsBox.innerHTML =
      "<p class='muted'>Tu carrito está vacío 🙂</p>";
    btnConfirmar.disabled = true;
    return;
  }

  itemsBox.innerHTML = `
    <ul>
      ${carrito
        .map(
          (p) =>
            `<li>${p.nombre} x ${p.cantidad} — $${p.precio}</li>`
        )
        .join("")}
    </ul>
  `;

  const { subtotal, descuento, envio, total } =
    calcularTotales(carrito, cuponActivo);

  rSub.textContent = `$${subtotal.toFixed(2)}`;
  rDesc.textContent =
    descuento > 0 ? `-$${descuento.toFixed(2)}` : "$0";
  rEnv.textContent =
    envio === 0 ? "GRATIS" : `$${envio.toFixed(2)}`;
  rTot.textContent = `$${total.toFixed(2)}`;
  rCupon.textContent = cuponActivo
    ? "Cupón PRIMERA15 aplicado (15% OFF)"
    : "";

  // ===============================
  // UX pago
  // ===============================
  document
    .querySelectorAll("input[name='pago']")
    .forEach((radio) => {
      radio.addEventListener("change", () => {
        pagoInfo.style.display = "inline-block";
        extraInfo.style.display = "block";

        if (radio.value === "mercadopago") {
          pagoInfo.textContent = "Mercado Pago seleccionado ✅";
          extraInfo.innerHTML = `
            <strong>Mercado Pago</strong>
            <p class="muted">
              Al confirmar, te enviaremos el link de pago.
            </p>`;
        } else {
          pagoInfo.textContent = "Transferencia seleccionada ✅";
          extraInfo.innerHTML = `
            <strong>Transferencia bancaria</strong>
            <p class="muted">
              Al confirmar, se mostrarán los datos bancarios.
            </p>`;
        }
      });
    });

  // ===============================
  // Volver
  // ===============================
 const btnVolver = document.getElementById("volver");

if (btnVolver) {
  btnVolver.addEventListener("click", (e) => {
    e.preventDefault();

    // Si hay historial, vuelve atrás
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // fallback seguro
      window.location.href = "productos.html";
    }
  });
}

  // ===============================
  // Confirmar pedido
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorBox.style.display = "none";
    errorBox.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const pago = form.elements["pago"]?.value;

    if (!nombre || !email || !telefono || !pago) {
      errorBox.style.display = "block";
      errorBox.textContent =
        "Por favor completá todos los datos.";
      return;
    }

    const orden = {
      id: generarIdOrden(),
      fechaISO: new Date().toISOString(),
      cliente: { nombre, email, telefono },
      pago,
      cuponActivo,
      totales: { subtotal, descuento, envio, total },
      items: carrito,
      estado: "recibida",
    };

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(orden),
      });
    } catch (err) {
      console.warn("Error enviando orden", err);
    }

    localStorage.setItem("ultimaOrden", JSON.stringify(orden));
    localStorage.setItem("carrito", JSON.stringify([]));
    localStorage.setItem("cuponActivo", JSON.stringify(false));

    window.location.href = "gracias.html";
  });
}
