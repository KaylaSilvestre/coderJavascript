// Simulador simple de compra de productos
const nombreEmprendimiento = "Hecho Pa'Mi";
let usuario = prompt(
  "¡Bienvenido/a a " + nombreEmprendimiento + "! ✨ ¿Cuál es tu nombre?"
);

alert(
  "Hola " +
    usuario +
    " 👋\nUsando el código PRIMERA15 tenés 15% OFF en tu primera compra. 🎁 \nY si tu compra supera los $1500, ¡el envío es GRATIS! 🚚"
);

console.log("El usuario ingresó al simulador: " + usuario);

// Clase producto
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre.toUpperCase();
    this.precio = parseFloat(precio); // Precio ya con IVA incluido
    this.vendido = false;
  }

  sumarIva() {
    const iva = this.precio * 0.22;
    console.log(
      `IVA simulado para ${this.nombre}: $${iva.toFixed(
        2
      )} (ya incluido en el precio final)`
    );
  }

  vender() {
    this.vendido = true;
  }
}

// Array de productos
const productos = [];
productos.push(new Producto("Mate grabado", 600));
productos.push(new Producto("Llavero personalizado", 45));
productos.push(new Producto("Vaso tipo Stanley grabado", 800));
productos.push(new Producto("Sticker en vinilo", 300));
productos.push(new Producto("Pantalla de techo 3D", 1650));
productos.push(new Producto("Lámpara impresa en 3D", 2000));

// Simula el calculo de IVA (por el momento no tienen IVA los productos)
for (const producto of productos) {
  producto.sumarIva();
}

// Funcinn para mostrar productos
function mostrarProductos(lista) {
  let mensaje = "✨ Productos disponibles ✨\n";
  for (let i = 0; i < lista.length; i++) {
    mensaje +=
      i +
      1 +
      ". " +
      lista[i].nombre +
      " - $" +
      lista[i].precio.toFixed(2) +
      "\n";
  }
  return mensaje;
}

// Función principal de compra con carrito
function comprarProductos() {
  let carrito = [];
  let continuar = true;

  while (continuar) {
    let opciones = mostrarProductos(productos);
    let eleccion = parseInt(
      prompt(
        opciones +
          "\nElige el número del producto que deseas agregar al carrito (o 0 para terminar):"
      )
    );

    if (eleccion === 0 || eleccion === null || isNaN(eleccion)) {
      continuar = false;
      alert(
        "🛍️ Finalizaste tu compra. Gracias por elegir " +
          nombreEmprendimiento +
          " 💕"
      );
    } else if (eleccion > 0 && eleccion <= productos.length) {
      let productoSeleccionado = productos[eleccion - 1];
      carrito.push(productoSeleccionado);
      alert(productoSeleccionado.nombre + " fue agregado al carrito 🛒");
    } else {
      alert("Opción no válida. Intenta nuevamente ⚠️");
    }
  }

  if (carrito.length === 0) {
    alert("No agregaste ningún producto. ¡Hasta la próxima! 👋");
    return;
  }

  // Mostrar carrito
  let resumen = "🛒 Tu carrito contiene:\n";
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    resumen +=
      i +
      1 +
      ". " +
      carrito[i].nombre +
      " - $" +
      carrito[i].precio.toFixed(2) +
      "\n";
    total += carrito[i].precio;
  }

  alert(resumen + "\nTotal actual: $" + total.toFixed(2));

  // Opción para eliminar productos
  let eliminar = confirm(
    "¿Querés eliminar algún producto antes de confirmar la compra?"
  );
  if (eliminar) {
    let seguirEliminando = true;

    while (seguirEliminando && carrito.length > 0) {
      // Mostrar lista actualizada del carrito
      let listaCarrito = "🛒 Productos en tu carrito:\n";
      for (let i = 0; i < carrito.length; i++) {
        listaCarrito +=
          i +
          1 +
          ". " +
          carrito[i].nombre +
          " - $" +
          carrito[i].precio.toFixed(2) +
          "\n";
      }

      // Preguntar que producto eliminar
      let entrada = prompt(
        listaCarrito +
          "\nIndica el número del producto que querés eliminar (o 0 para salir):"
      );

      // Si presiona Cancelar sale del bucle
      if (entrada === null) {
        seguirEliminando = false;
        break;
      }

      let numEliminar = parseInt(entrada);

      // Si pone 0 sale del bucle
      if (numEliminar === 0) {
        seguirEliminando = false;
      } else if (numEliminar > 0 && numEliminar <= carrito.length) {
        let eliminado = carrito.splice(numEliminar - 1, 1)[0];
        alert("Se eliminó " + eliminado.nombre + " del carrito 🗑️");

        // Si el carrito queda vacio
        if (carrito.length === 0) {
          alert("Tu carrito ahora está vacío 🛒");
          seguirEliminando = false;
        } else {
          seguirEliminando = confirm("¿Querés eliminar otro producto?");
        }
      } else {
        alert("Número inválido. Intenta nuevamente ⚠️");
      }
    }
  }

  // Calcular total final
  let totalFinal = 0;
  for (const item of carrito) {
    item.vender();
    totalFinal += item.precio;
  }

  // Preguntar por cuponn con opcion a reintentar
  let usarCupon = confirm("¿Tenés un cupón de descuento? 💌");
  let descuento = 0;
  if (usarCupon) {
    let codigoValido = false;
    while (!codigoValido) {
      let codigo = prompt("Ingresá tu código de descuento:");
      if (!codigo) {
        alert("No ingresaste ningún código. Continuaremos sin descuento.");
        break;
      } else if (codigo.toUpperCase() === "PRIMERA15") {
        descuento = totalFinal * 0.15;
        totalFinal *= 0.85;
        alert("✨ Cupón aplicado correctamente. ¡15% OFF en tu compra! ✨");
        console.log(
          `Cupón aplicado correctamente (${codigo}).\nDescuento: $${descuento.toFixed(
            2
          )}\nTotal con descuento: $${totalFinal.toFixed(2)}`
        );
        codigoValido = true;
      } else {
        let reintentar = confirm(
          "⚠️ Código inválido. ¿Querés intentarlo de nuevo?"
        );
        if (!reintentar) {
          alert("Continuaremos sin descuento.");
          break;
        }
      }
    }
  }

  // Envio gratis si supera $1500
  let tieneEnvioGratis = false;
  let envio = 0;
  if (totalFinal >= 1500) {
    tieneEnvioGratis = true;
    alert("¡Felicidades! Tu compra supera los $1500, tenés ENVÍO GRATIS 🚚 ");
    console.log("El cliente obtuvo envío gratis 🎁");
  } else {
    envio = 150;
    totalFinal += envio;
    alert(
      "Tu compra no supera los $1500, se agregan $" + envio + " de envío 📦"
    );
    console.log("Se agregó costo de envío: $" + envio);
  }

  // Se muestra resumen final detallado
let resumenFinal = "🧾 RESUMEN FINAL 🧾\n\n";

// Lista de productos comprados
resumenFinal += "🛍️ Productos comprados:\n";
for (let i = 0; i < carrito.length; i++) {
    resumenFinal += (i + 1) + ". " + carrito[i].nombre + " - $" + carrito[i].precio.toFixed(2) + "\n";
}

// Subtotal y descuentos
resumenFinal += `\n💵 Subtotal: $${total.toFixed(2)}\n`;
if (descuento > 0) {
    resumenFinal += `💌 Descuento (15% OFF - Cupón PRIMERA15): -$${descuento.toFixed(2)}\n`;
}

// Envio
if (tieneEnvioGratis) {
    resumenFinal += `🚚 Envío: GRATIS\n`;
} else {
    resumenFinal += `📦 Envío: $${envio.toFixed(2)}\n`;
}

// Total final
resumenFinal += `\n💰 Total a pagar: $${totalFinal.toFixed(2)}\n\n`;

resumenFinal += `Gracias por tu compra, ${usuario} 💕\n¡Esperamos verte pronto en ${nombreEmprendimiento}! ✨`;

alert(resumenFinal);

// Registro interno en consola
console.log("===== RESUMEN DE COMPRA =====");
console.log("Cliente:", usuario);
console.log("Productos comprados:");
carrito.forEach((item, i) => console.log(`${i + 1}. ${item.nombre} - $${item.precio.toFixed(2)}`));
console.log("-----------------------------");
console.log("Subtotal:", `$${total.toFixed(2)}`);
if (descuento > 0) console.log("Descuento aplicado:", `-$${descuento.toFixed(2)} (15% OFF)`);
if (tieneEnvioGratis) {
    console.log("Envío: GRATIS");
} else {
    console.log("Envío:", `$${envio.toFixed(2)}`);
}
console.log("-----------------------------");
console.log("Total final a pagar:", `$${totalFinal.toFixed(2)}`);
console.log("=============================");

}

comprarProductos();
