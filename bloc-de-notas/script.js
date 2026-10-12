// =======================================================
// CONFIGURACIÓN DE SUPABASE
// =======================================================

const SUPABASE_URL =
    "https://xkhfmrphwkvgarofofkl.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_v6E1AeBhtNSlG78Ifvs6jQ_y4-4BvCe";


const sb =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



// =======================================================
// ELEMENTOS HTML
// =======================================================

const tituloNota =
    document.getElementById(
        "tituloNota"
    );


const contenidoNota =
    document.getElementById(
        "contenidoNota"
    );


const nuevaNota =
    document.getElementById(
        "nuevaNota"
    );


const guardarNota =
    document.getElementById(
        "guardarNota"
    );


const descargarNota =
    document.getElementById(
        "descargarNota"
    );


const borrarNota =
    document.getElementById(
        "borrarNota"
    );


const estadoGuardado =
    document.getElementById(
        "estadoGuardado"
    );


const contadorPalabras =
    document.getElementById(
        "contadorPalabras"
    );


const listaNotas =
    document.getElementById(
        "listaNotas"
    );


const mensajeNotas =
    document.getElementById(
        "mensajeNotas"
    );


const estadoCuenta =
    document.getElementById(
        "estadoCuenta"
    );


const abrirLogin =
    document.getElementById(
        "abrirLogin"
    );


const cerrarSesion =
    document.getElementById(
        "cerrarSesion"
    );


const modalAuth =
    document.getElementById(
        "modalAuth"
    );


const cerrarModal =
    document.getElementById(
        "cerrarModal"
    );


const mostrarLogin =
    document.getElementById(
        "mostrarLogin"
    );


const mostrarRegistro =
    document.getElementById(
        "mostrarRegistro"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const registroForm =
    document.getElementById(
        "registroForm"
    );


const mensajeAuth =
    document.getElementById(
        "mensajeAuth"
    );


const adminPanel =
    document.getElementById(
        "adminPanel"
    );


const notasAdmin =
    document.getElementById(
        "notasAdmin"
    );


const actualizarAdmin =
    document.getElementById(
        "actualizarAdmin"
    );



// =======================================================
// VARIABLES
// =======================================================

let usuarioActual = null;

let perfilActual = null;

let notaActualId = null;

let notasUsuario = [];

let temporizadorGuardado = null;

let guardarDespuesDeLogin = false;

let borradorPendiente = null;



// =======================================================
// CONTADOR DE PALABRAS
// =======================================================

function contarPalabras() {

    const texto =
        contenidoNota
        .value
        .trim();


    let cantidad = 0;


    if (texto !== "") {

        cantidad =
            texto
            .split(/\s+/)
            .length;

    }


    contadorPalabras.textContent =
        `${cantidad} palabras`;

}



// =======================================================
// MODAL
// =======================================================

function abrirModalAuth(
    modo = "login"
) {

    modalAuth.classList.remove(
        "oculto"
    );


    mensajeAuth.textContent =
        "";


    if (modo === "registro") {

        mostrarFormularioRegistro();

    }

    else {

        mostrarFormularioLogin();

    }

}



function cerrarModalAuth(
    cancelarGuardado = true
) {

    modalAuth.classList.add(
        "oculto"
    );


    mensajeAuth.textContent =
        "";


    if (cancelarGuardado) {

        guardarDespuesDeLogin =
            false;

        borradorPendiente =
            null;

    }

}



function mostrarFormularioLogin() {

    loginForm.classList.remove(
        "oculto"
    );


    registroForm.classList.add(
        "oculto"
    );


    mostrarLogin.classList.add(
        "activo"
    );


    mostrarRegistro.classList.remove(
        "activo"
    );

}



function mostrarFormularioRegistro() {

    registroForm.classList.remove(
        "oculto"
    );


    loginForm.classList.add(
        "oculto"
    );


    mostrarRegistro.classList.add(
        "activo"
    );


    mostrarLogin.classList.remove(
        "activo"
    );

}



abrirLogin.addEventListener(
    "click",
    () => {

        abrirModalAuth(
            "login"
        );

    }
);



cerrarModal.addEventListener(
    "click",
    () => {

        cerrarModalAuth(true);

    }
);



mostrarLogin.addEventListener(
    "click",
    mostrarFormularioLogin
);



mostrarRegistro.addEventListener(
    "click",
    mostrarFormularioRegistro
);



modalAuth.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target ===
            modalAuth
        ) {

            cerrarModalAuth(true);

        }

    }
);



// =======================================================
// CREAR CUENTA
// =======================================================

registroForm.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const username =
            document
            .getElementById(
                "registroUsuario"
            )
            .value
            .trim();


        const email =
            document
            .getElementById(
                "registroEmail"
            )
            .value
            .trim();


        const password =
            document
            .getElementById(
                "registroPassword"
            )
            .value;


        if (
            username.length < 3
        ) {

            mensajeAuth.textContent =
                "El nombre de usuario debe tener al menos 3 caracteres.";

            return;

        }


        if (
            password.length < 8
        ) {

            mensajeAuth.textContent =
                "La contraseña debe tener al menos 8 caracteres.";

            return;

        }


        mensajeAuth.textContent =
            "Creando cuenta...";


        const {
            data,
            error
        } =
        await sb.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    username:
                        username

                },

                emailRedirectTo:
                    "https://yoinervictorino.com/bloc-de-notas/"

            }

        });


        if (error) {

            console.error(error);

            mensajeAuth.textContent =
                error.message;

            return;

        }


        registroForm.reset();


        if (
            data.session
        ) {

            mensajeAuth.textContent =
                "Cuenta creada correctamente.";


            await activarSesion(
                data.user,
                guardarDespuesDeLogin
            );


            await guardarBorradorPendiente();


            cerrarModalAuth(false);

        }

        else {

            mensajeAuth.textContent =
                "Cuenta creada. Revisa tu correo y confirma tu dirección. Después vuelve aquí e inicia sesión.";

        }

    }
);



// =======================================================
// INICIAR SESIÓN
// =======================================================

loginForm.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const email =
            document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


        const password =
            document
            .getElementById(
                "loginPassword"
            )
            .value;


        mensajeAuth.textContent =
            "Iniciando sesión...";


        const {
            data,
            error
        } =
        await sb.auth
        .signInWithPassword({

            email:
                email,

            password:
                password

        });


        if (error) {

            console.error(error);

            mensajeAuth.textContent =
                "Correo o contraseña incorrectos.";

            return;

        }


        loginForm.reset();


        await activarSesion(
            data.user,
            guardarDespuesDeLogin
        );


        await guardarBorradorPendiente();


        cerrarModalAuth(false);

    }
);



// =======================================================
// ACTIVAR SESIÓN
// =======================================================

async function activarSesion(
    usuario,
    preservarEditor = false
) {

    usuarioActual =
        usuario;


    const {
        data: perfil,
        error
    } =
    await sb
    .from("profiles")
    .select(
        "username, email, role"
    )
    .eq(
        "id",
        usuario.id
    )
    .single();


    if (error) {

        console.error(
            "Error cargando perfil:",
            error
        );

        return;

    }


    perfilActual =
        perfil;


    estadoCuenta.textContent =
        perfil.username;


    abrirLogin.classList.add(
        "oculto"
    );


    cerrarSesion.classList.remove(
        "oculto"
    );


    mensajeNotas.classList.add(
        "oculto"
    );


    await cargarNotas(
        !preservarEditor
    );


    if (
        perfil.role === "admin"
    ) {

        adminPanel.classList.remove(
            "oculto"
        );


        await cargarNotasAdmin();

    }

    else {

        adminPanel.classList.add(
            "oculto"
        );

    }

}



// =======================================================
// MODO INVITADO
// =======================================================

function activarModoInvitado(
    limpiar = false
) {

    usuarioActual =
        null;


    perfilActual =
        null;


    notaActualId =
        null;


    notasUsuario =
        [];


    estadoCuenta.textContent =
        "Modo invitado";


    abrirLogin.classList.remove(
        "oculto"
    );


    cerrarSesion.classList.add(
        "oculto"
    );


    mensajeNotas.classList.remove(
        "oculto"
    );


    listaNotas.innerHTML =
        "";


    adminPanel.classList.add(
        "oculto"
    );


    notasAdmin.innerHTML =
        "";


    if (limpiar) {

        tituloNota.value =
            "";

        contenidoNota.value =
            "";

        contarPalabras();

    }


    estadoGuardado.textContent =
        "Puedes escribir sin iniciar sesión";

}



// =======================================================
// CERRAR SESIÓN
// =======================================================

cerrarSesion.addEventListener(
    "click",
    async () => {

        await sb.auth.signOut();


        activarModoInvitado(
            true
        );

    }
);



// =======================================================
// CARGAR NOTAS
// =======================================================

async function cargarNotas(
    abrirPrimera = true
) {

    if (!usuarioActual) {

        return;

    }


    const {
        data,
        error
    } =
    await sb
    .from("notes")
    .select(
        "id, title, content, created_at, updated_at"
    )
    .eq(
        "user_id",
        usuarioActual.id
    )
    .order(
        "updated_at",
        {
            ascending:
                false
        }
    );


    if (error) {

        console.error(
            "Error cargando notas:",
            error
        );

        estadoGuardado.textContent =
            "Error al cargar las notas";

        return;

    }


    notasUsuario =
        data || [];


    renderizarNotas();


    if (
        abrirPrimera &&
        notasUsuario.length > 0
    ) {

        abrirNota(
            notasUsuario[0].id
        );

    }


    if (
        abrirPrimera &&
        notasUsuario.length === 0
    ) {

        notaActualId =
            null;

        tituloNota.value =
            "";

        contenidoNota.value =
            "";

        contarPalabras();


        estadoGuardado.textContent =
            "No tienes notas guardadas";

    }

}



// =======================================================
// RENDERIZAR LISTA
// =======================================================

function renderizarNotas() {

    listaNotas.innerHTML =
        "";


    if (
        notasUsuario.length === 0
    ) {

        const mensaje =
            document.createElement(
                "p"
            );


        mensaje.className =
            "mensaje-notas";


        mensaje.textContent =
            "Todavía no tienes notas guardadas.";


        listaNotas.appendChild(
            mensaje
        );


        return;

    }


    notasUsuario.forEach(
        (nota) => {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "nota-lista";


            if (
                nota.id ===
                notaActualId
            ) {

                boton.classList.add(
                    "activa"
                );

            }


            boton.textContent =
                nota.title ||
                "Sin título";


            boton.addEventListener(
                "click",
                () => {

                    abrirNota(
                        nota.id
                    );

                }
            );


            listaNotas.appendChild(
                boton
            );

        }
    );

}



// =======================================================
// ABRIR NOTA
// =======================================================

function abrirNota(id) {

    const nota =
        notasUsuario.find(
            item =>
                item.id === id
        );


    if (!nota) {

        return;

    }


    notaActualId =
        nota.id;


    tituloNota.value =
        nota.title || "";


    contenidoNota.value =
        nota.content || "";


    contarPalabras();


    estadoGuardado.textContent =
        "Nota cargada";


    renderizarNotas();

}



// =======================================================
// NUEVA NOTA
// =======================================================

nuevaNota.addEventListener(
    "click",
    () => {

        notaActualId =
            null;


        tituloNota.value =
            "";


        contenidoNota.value =
            "";


        contarPalabras();


        if (usuarioActual) {

            estadoGuardado.textContent =
                "Nueva nota sin guardar";

        }

        else {

            estadoGuardado.textContent =
                "Inicia sesión cuando quieras guardarla";

        }


        renderizarNotas();


        tituloNota.focus();

    }
);



// =======================================================
// BOTÓN GUARDAR
// =======================================================

guardarNota.addEventListener(
    "click",
    async () => {

        if (!usuarioActual) {

            borradorPendiente = {

                title:
                    tituloNota
                    .value
                    .trim(),

                content:
                    contenidoNota
                    .value

            };


            guardarDespuesDeLogin =
                true;


            abrirModalAuth(
                "login"
            );


            mensajeAuth.textContent =
                "Inicia sesión o crea una cuenta para guardar esta nota.";


            return;

        }


        await guardarNotaEnNube();

    }
);



// =======================================================
// GUARDAR EN SUPABASE
// =======================================================

async function guardarNotaEnNube(
    automatico = false
) {

    if (!usuarioActual) {

        return;

    }


    const titulo =
        tituloNota
        .value
        .trim();


    const contenido =
        contenidoNota
        .value;


    if (
        titulo === "" &&
        contenido.trim() === ""
    ) {

        estadoGuardado.textContent =
            "La nota está vacía";

        return;

    }


    estadoGuardado.textContent =
        "Guardando...";


    if (notaActualId) {

        const {
            error
        } =
        await sb
        .from("notes")
        .update({

            title:
                titulo,

            content:
                contenido

        })
        .eq(
            "id",
            notaActualId
        )
        .eq(
            "user_id",
            usuarioActual.id
        );


        if (error) {

            console.error(error);

            estadoGuardado.textContent =
                "Error al guardar";

            return;

        }

    }

    else {

        const {
            data,
            error
        } =
        await sb
        .from("notes")
        .insert({

            user_id:
                usuarioActual.id,

            title:
                titulo,

            content:
                contenido

        })
        .select(
            "id"
        )
        .single();


        if (error) {

            console.error(error);

            estadoGuardado.textContent =
                "Error al guardar";

            return;

        }


        notaActualId =
            data.id;

    }


    estadoGuardado.textContent =
        automatico
        ?
        "✓ Guardado automáticamente"
        :
        "✓ Nota guardada";


    await actualizarListaSinCambiarEditor();


    if (
        perfilActual?.role ===
        "admin"
    ) {

        await cargarNotasAdmin();

    }

}



// =======================================================
// ACTUALIZAR LISTA
// =======================================================

async function actualizarListaSinCambiarEditor() {

    if (!usuarioActual) {

        return;

    }


    const {
        data,
        error
    } =
    await sb
    .from("notes")
    .select(
        "id, title, content, created_at, updated_at"
    )
    .eq(
        "user_id",
        usuarioActual.id
    )
    .order(
        "updated_at",
        {
            ascending:
                false
        }
    );


    if (error) {

        console.error(error);

        return;

    }


    notasUsuario =
        data || [];


    renderizarNotas();

}



// =======================================================
// GUARDAR BORRADOR DESPUÉS DE LOGIN
// =======================================================

async function guardarBorradorPendiente() {

    if (
        !guardarDespuesDeLogin ||
        !borradorPendiente
    ) {

        return;

    }


    notaActualId =
        null;


    tituloNota.value =
        borradorPendiente.title;


    contenidoNota.value =
        borradorPendiente.content;


    contarPalabras();


    guardarDespuesDeLogin =
        false;


    borradorPendiente =
        null;


    await guardarNotaEnNube();

}



// =======================================================
// AUTOGUARDADO
// =======================================================

function programarAutoguardado() {

    contarPalabras();


    clearTimeout(
        temporizadorGuardado
    );


    if (!usuarioActual) {

        estadoGuardado.textContent =
            "Inicia sesión para guardar";

        return;

    }


    if (!notaActualId) {

        estadoGuardado.textContent =
            "Nueva nota sin guardar";

        return;

    }


    estadoGuardado.textContent =
        "Cambios sin guardar...";


    temporizadorGuardado =
        setTimeout(

            async () => {

                await guardarNotaEnNube(
                    true
                );

            },

            900

        );

}



tituloNota.addEventListener(
    "input",
    programarAutoguardado
);



contenidoNota.addEventListener(
    "input",
    programarAutoguardado
);



// =======================================================
// BORRAR
// =======================================================

borrarNota.addEventListener(
    "click",
    async () => {

        if (!usuarioActual) {

            tituloNota.value =
                "";

            contenidoNota.value =
                "";

            contarPalabras();


            estadoGuardado.textContent =
                "Contenido borrado";


            return;

        }


        if (!notaActualId) {

            tituloNota.value =
                "";

            contenidoNota.value =
                "";

            contarPalabras();


            estadoGuardado.textContent =
                "Contenido borrado";


            return;

        }


        const confirmar =
            confirm(
                "¿Seguro que quieres eliminar esta nota?"
            );


        if (!confirmar) {

            return;

        }


        const {
            error
        } =
        await sb
        .from("notes")
        .delete()
        .eq(
            "id",
            notaActualId
        )
        .eq(
            "user_id",
            usuarioActual.id
        );


        if (error) {

            console.error(error);

            estadoGuardado.textContent =
                "Error al eliminar";

            return;

        }


        notaActualId =
            null;


        tituloNota.value =
            "";

        contenidoNota.value =
            "";


        contarPalabras();


        await cargarNotas(
            true
        );


        estadoGuardado.textContent =
            "Nota eliminada";


        if (
            perfilActual?.role ===
            "admin"
        ) {

            await cargarNotasAdmin();

        }

    }
);



// =======================================================
// DESCARGAR TXT
// =======================================================

descargarNota.addEventListener(
    "click",
    () => {

        let titulo =
            tituloNota
            .value
            .trim();


        if (
            titulo === ""
        ) {

            titulo =
                "mi-nota";

        }


        titulo =
            titulo.replace(
                /[\\/:*?"<>|]/g,
                "-"
            );


        const texto =
            tituloNota.value +
            "\n\n" +
            contenidoNota.value;


        const archivo =
            new Blob(

                [texto],

                {

                    type:
                        "text/plain;charset=utf-8"

                }

            );


        const enlace =
            document
            .createElement(
                "a"
            );


        enlace.href =
            URL.createObjectURL(
                archivo
            );


        enlace.download =
            titulo + ".txt";


        enlace.click();


        URL.revokeObjectURL(
            enlace.href
        );

    }
);



// =======================================================
// PANEL ADMINISTRADOR
// =======================================================

actualizarAdmin.addEventListener(
    "click",
    cargarNotasAdmin
);



async function cargarNotasAdmin() {

    if (
        perfilActual?.role !==
        "admin"
    ) {

        return;

    }


    const {
        data,
        error
    } =
    await sb
    .from("notes")
    .select(`
        id,
        title,
        content,
        created_at,
        updated_at,
        profiles (
            username,
            email
        )
    `)
    .order(
        "updated_at",
        {
            ascending:
                false
        }
    );


    if (error) {

        console.error(
            "Error panel admin:",
            error
        );


        notasAdmin.textContent =
            "No se pudieron cargar las notas.";

        return;

    }


    notasAdmin.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        notasAdmin.textContent =
            "Todavía no hay notas guardadas.";

        return;

    }


    data.forEach(
        (nota) => {

            const tarjeta =
                document
                .createElement(
                    "article"
                );


            tarjeta.className =
                "admin-nota";


            const usuario =
                document
                .createElement(
                    "h3"
                );


            usuario.textContent =
                nota.profiles
                ?.username
                ||
                "Usuario";


            const email =
                document
                .createElement(
                    "p"
                );


            email.className =
                "admin-email";


            email.textContent =
                nota.profiles
                ?.email
                ||
                "";


            const titulo =
                document
                .createElement(
                    "h4"
                );


            titulo.textContent =
                nota.title
                ||
                "Sin título";


            const contenido =
                document
                .createElement(
                    "pre"
                );


            contenido.textContent =
                nota.content
                ||
                "";


            const fecha =
                document
                .createElement(
                    "div"
                );


            fecha.className =
                "admin-fecha";


            fecha.textContent =
                "Actualizada: " +
                new Date(
                    nota.updated_at
                )
                .toLocaleString();


            tarjeta.appendChild(
                usuario
            );


            tarjeta.appendChild(
                email
            );


            tarjeta.appendChild(
                titulo
            );


            tarjeta.appendChild(
                contenido
            );


            tarjeta.appendChild(
                fecha
            );


            notasAdmin.appendChild(
                tarjeta
            );

        }
    );

}



// =======================================================
// DETECTAR CAMBIOS DE AUTENTICACIÓN
// =======================================================

sb.auth.onAuthStateChange(
    (
        evento,
        session
    ) => {

        if (
            evento === "SIGNED_IN" &&
            session?.user &&
            !usuarioActual
        ) {

            setTimeout(
                () => {

                    activarSesion(
                        session.user,
                        false
                    );

                },

                0
            );

        }


        if (
            evento === "SIGNED_OUT"
        ) {

            activarModoInvitado(
                true
            );

        }

    }
);



// =======================================================
// INICIAR PÁGINA
// =======================================================

async function iniciar() {

    contarPalabras();


    const {
        data
    } =
    await sb.auth.getSession();


    if (
        data.session?.user
    ) {

        await activarSesion(
            data.session.user,
            false
        );

    }

    else {

        activarModoInvitado(
            false
        );

    }

}



iniciar();