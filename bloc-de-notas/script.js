// Cargar nota guardada al abrir la página

window.addEventListener("load", () => {

    const tituloGuardado =
        localStorage.getItem("tituloNota");

    const contenidoGuardado =
        localStorage.getItem("contenidoNota");

    if (tituloGuardado) {
        tituloNota.value = tituloGuardado;
    }

    if (contenidoGuardado) {
        contenidoNota.value = contenidoGuardado;
    }

    contarPalabras();

});


// Guardar la nota

function guardar() {

    localStorage.setItem(
        "tituloNota",
        tituloNota.value
    );

    localStorage.setItem(
        "contenidoNota",
        contenidoNota.value
    );

    estadoGuardado.textContent =
        "✓ Nota guardada";

}


// Botón guardar

guardarNota.addEventListener(
    "click",
    guardar
);


// Guardado automático

contenidoNota.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "contenidoNota",
            contenidoNota.value
        );

        estadoGuardado.textContent =
            "Guardando...";

        contarPalabras();

        setTimeout(() => {

            estadoGuardado.textContent =
                "✓ Guardado automáticamente";

        }, 500);

    }
);


// Guardar título automáticamente

tituloNota.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "tituloNota",
            tituloNota.value
        );

    }
);


// Crear nueva nota

nuevaNota.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "¿Quieres crear una nueva nota?"
            );

        if (confirmar) {

            tituloNota.value = "";

            contenidoNota.value = "";

            localStorage.removeItem(
                "tituloNota"
            );

            localStorage.removeItem(
                "contenidoNota"
            );

            contarPalabras();

            estadoGuardado.textContent =
                "Nueva nota";

        }

    }
);


// Borrar contenido

borrarNota.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "¿Seguro que quieres borrar la nota?"
            );

        if (confirmar) {

            tituloNota.value = "";

            contenidoNota.value = "";

            localStorage.clear();

            contarPalabras();

            estadoGuardado.textContent =
                "Nota eliminada";

        }

    }
);


// Descargar como archivo TXT

descargarNota.addEventListener(
    "click",
    () => {

        let titulo =
            tituloNota.value.trim();

        if (titulo === "") {
            titulo = "mi-nota";
        }

        const texto =
            tituloNota.value +
            "\n\n" +
            contenidoNota.value;

        const archivo =
            new Blob(
                [texto],
                {
                    type: "text/plain"
                }
            );

        const enlace =
            document.createElement("a");

        enlace.href =
            URL.createObjectURL(archivo);

        enlace.download =
            titulo + ".txt";

        enlace.click();

        URL.revokeObjectURL(
            enlace.href
        );

    }
);


// Contar palabras

function contarPalabras() {

    const texto =
        contenidoNota.value.trim();

    let cantidad = 0;

    if (texto !== "") {

        cantidad =
            texto.split(/\s+/).length;

    }

    contadorPalabras.textContent =
        cantidad + " palabras";

}
