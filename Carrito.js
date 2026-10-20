"use strict";

class Carrito {
    constructor(productos, moneda = "€") {
        this.moneda = moneda;

        // Store prices as integer cents to avoid rounding errors.
        this.productos = productos.map((producto) => ({
            sku: producto.SKU,
            titulo: producto.title,
            precioCentimos: Math.round(Number(producto.price) * 100),
            unidades: 0
        }));
    }

    actualizarUnidades(sku, unidades) {
        if (!Number.isInteger(unidades) || unidades < 0) {
            throw new Error("Las unidades deben ser un entero mayor o igual a cero.");
        }

        const producto = this.productos.find(
            (producto) => producto.sku === sku
        );

        if (!producto) {
            throw new Error("No se ha encontrado el producto.");
        }

        producto.unidades = unidades;
    }

    obtenerInformacionProducto(sku) {
        const producto = this.productos.find(
            (producto) => producto.sku === sku
        );

        if (!producto) {
            throw new Error("No se ha encontrado el producto.");
        }

        // Return a copy so external code cannot modify the stored product.
        return {
            sku: producto.sku,
            title: producto.titulo,
            price: producto.precioCentimos / 100,
            quantity: producto.unidades,
            subtotal: producto.precioCentimos * producto.unidades / 100
        };
    }

    obtenerCarrito() {
        const seleccionados = this.productos.filter(
            (producto) => producto.unidades > 0
        );

        const totalCentimos = seleccionados.reduce(
            (total, producto) =>
                total + producto.precioCentimos * producto.unidades,
            0
        );

        return {
            total: totalCentimos / 100,
            currency: this.moneda,
            products: seleccionados.map((producto) =>
                this.obtenerInformacionProducto(producto.sku)
            )
        };
    }
}