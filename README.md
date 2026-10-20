# agoodshop — Carrito de la compra

Actividad 1 - Desarrollo Web en Entorno Cliente.

Aplicación web para mostrar un catálogo predeterminado de productos y seleccionar unidades, consultar subtotales y calcular el total de la compra.

## Tecnologías utilizadas

- HTML5 para la estructura.
- CSS3 para los estilos y la adaptación a pantallas pequeñas.
- JavaScript para la lógica, los eventos y la manipulación del DOM.
- JSONBlob para alojar los datos de la API.

## Estructura del proyecto

- index.html: estructura de la página.
- css/styles.css: estilos de la interfaz.
- js/Carrito.js: clase que gestiona los productos, las cantidades y los cálculos.
- js/app.js: conexión con la API, creación de elementos del DOM y gestión de eventos.
- README.md: documentación e instrucciones de ejecución.

## Funcionamiento

La aplicación llama a los productos mediante fetch y crea una instancia de
la clase Carrito con los datos recibidos.

Cada producto dispone de un campo de unidades. Al modificar una cantidad
válida, se actualizan su subtotal, el resumen de productos seleccionados y
el total de la compra.

Los productos con cero unidades no aparecen en el resumen.

La clase Carrito es independiente del HTML y no interactúa con el DOM.
Los precios se almacenan internamente en céntimos para evitar errores
de precisión en los cálculos monetarios.

Las cantidades se mantienen en memoria y se reinician al recargar la página.

## Requisitos de ejecución

- Un navegador actualizado.
- Conexión a Internet para consultar la API.
- Python 3 instalado, si se utiliza el servidor local descrito a continuación.

Python se utiliza solamente para servir los archivos durante la ejecución local.
La aplicación está desarrollada en HTML, CSS y JavaScript.

## Ejecución local

1. Descargar y descomprimir el proyecto, o clonar el repositorio.
2. Abrir un terminal dentro de la carpeta que contiene index.html.
3. Ejecutar:

```bash
py -m http.server 8000
```

4. Abrir http://localhost:8000 en el navegador.
5. Mantener el terminal abierto mientras se utiliza la aplicación.

Para detener el servidor, pulsar Ctrl + C en el terminal.

## API de productos

https://jsonblob.com/api/jsonBlob/01a158f1-8f48-7905-88e2-bbf265043107

La respuesta contiene la moneda y una lista de productos con los campos
SKU, title y price.

Si la petición falla, la aplicación muestra un mensaje de error en la página.

## Comprobaciones funcionales

- Carga de los tres productos desde la API.
- Carrito inicial vacío y total a cero.
- Actualización de subtotales y total al cambiar cantidades.
- Retirada del resumen de los productos cuyas unidades pasan a cero.
- Rechazo de cantidades negativas o decimales.
- Restauración de la última cantidad válida al abandonar un campo inválido.
- Reinicio de cantidades al recargar la página.
- Adaptación de la distribución a pantallas pequeñas.

Ejemplo de cálculo:
un teléfono, dos cargadores y una funda suman 1118,96 €.