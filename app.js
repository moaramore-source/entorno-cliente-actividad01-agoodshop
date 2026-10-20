"use strict";

const API_URL =
    "https://jsonblob.com/api/jsonBlob/01a158f1-8f48-7905-88e2-bbf265043107";

const estado = document.querySelector("#estado");
const listadoProductos = document.querySelector("#productos");
const listadoResumen = document.querySelector("#resumen");
const total = document.querySelector("#total");

function formatearImporte(importe, moneda) {
    return `${importe.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} ${moneda}`;
}

function actualizarResumen(carrito) {
    const informacion = carrito.obtenerCarrito();

    // Clear the previous summary before rendering the current selection.
    listadoResumen.replaceChildren();

    if (informacion.products.length === 0) {
        const mensaje = document.createElement("li");
        mensaje.textContent = "No has seleccionado ningún producto.";
        listadoResumen.append(mensaje);
    } else {
        informacion.products.forEach((producto) => {
            const elemento = document.createElement("li");

            elemento.textContent =
                `${producto.title} × ${producto.quantity}: ` +
                formatearImporte(producto.subtotal, informacion.currency);

            listadoResumen.append(elemento);
        });
    }

    total.textContent = formatearImporte(
        informacion.total,
        informacion.currency
    );
}

function mostrarProductos(productos, carrito) {
    listadoProductos.replaceChildren();

    productos.forEach((producto) => {
        const informacion = carrito.obtenerInformacionProducto(producto.SKU);

        const fila = document.createElement("article");
        fila.className = "producto";

        const detalles = document.createElement("div");

        const titulo = document.createElement("h4");
        titulo.textContent = informacion.title;

        const precio = document.createElement("p");
        precio.textContent = formatearImporte(
            informacion.price,
            carrito.moneda
        );

        detalles.append(titulo, precio);

        const control = document.createElement("div");
        control.className = "cantidad";

        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = `cantidad-${informacion.sku}`;
        etiqueta.textContent = "Unidades";

        const entrada = document.createElement("input");
        entrada.id = etiqueta.htmlFor;
        entrada.type = "number";
        entrada.min = "0";
        entrada.step = "1";
        entrada.value = String(informacion.quantity);
        entrada.setAttribute(
            "aria-label",
            `Unidades de ${informacion.title}`
        );

        const subtotal = document.createElement("p");
        subtotal.className = "subtotal";
        subtotal.textContent = formatearImporte(
            informacion.subtotal,
            carrito.moneda
        );

        // Update the cart and the page whenever the quantity changes.
        entrada.addEventListener("input", () => {
            const unidades = entrada.valueAsNumber;

            if (!Number.isSafeInteger(unidades) || unidades < 0) {
                entrada.setCustomValidity(
                    "Introduce un número entero mayor o igual a cero."
                );
                entrada.reportValidity();
                return;
            }

            entrada.setCustomValidity("");

            carrito.actualizarUnidades(informacion.sku, unidades);

            const actualizado = carrito.obtenerInformacionProducto(
                informacion.sku
            );

            subtotal.textContent = formatearImporte(
                actualizado.subtotal,
                carrito.moneda
            );

            actualizarResumen(carrito);
        });

        // Restore the last valid quantity when leaving an invalid field.
        entrada.addEventListener("blur", () => {
            const actual = carrito.obtenerInformacionProducto(
                informacion.sku
            );

            entrada.value = String(actual.quantity);
            entrada.setCustomValidity("");
        });

        control.append(etiqueta, entrada);
        fila.append(detalles, control, subtotal);
        listadoProductos.append(fila);
    });
}

async function iniciarAplicacion() {
    estado.textContent = "Cargando productos...";

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (
            !Array.isArray(datos.products) ||
            typeof datos.currency !== "string"
        ) {
            throw new Error("La respuesta no tiene el formato esperado.");
        }

        const carrito = new Carrito(datos.products, datos.currency);

        mostrarProductos(datos.products, carrito);
        actualizarResumen(carrito);

        estado.textContent =
            `Se han cargado ${datos.products.length} productos correctamente.`;
    } catch (error) {
        estado.textContent =
            "No se han podido cargar los productos. Revisa la conexión y la URL.";

        console.error("Error al cargar los productos:", error);
    }
}

iniciarAplicacion();