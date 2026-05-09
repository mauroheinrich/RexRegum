// js/productos.js

const productos = [
    { 
        id: 1, 
        nombre: "Tetelastai", 
        precio: 25000, 
        colores: [
            { nombre: "Negro", img: "img/tetelastai_/tetelastai_negro.png" },
            { nombre: "Gris", img: "img/tetelastai_/tetelastai_gris.png" },
            { nombre: "Azul", img: "img/tetelastai_/tetelastai_azul.png" }
        ]
    },
    { 
        id: 2, 
        nombre: "En el uno", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/en_el_uno_/en_el_uno_blanco.png" },
            { nombre: "Negro", img: "img/en_el_uno_/en_el_uno_negro.png" },
            { nombre: "Gris", img: "img/en_el_uno_/en_el_uno_gris.png" },
            { nombre: "Azul", img: "img/en_el_uno_/en_el_uno_azul.png" }
        ]
    },
    { 
        id: 3, 
        nombre: "One", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/one_/one_blanco.png" },
            { nombre: "Gris", img: "img/one_/one_gris.png" },
            { nombre: "Azul", img: "img/one_/one_azul.png" }
        ]
    },
    { 
        id: 4, 
        nombre: "No temas solo ten fe", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/no_temas_solo_ten_fe_/no_temas_solo_ten_fe_blanco.png" },
            { nombre: "Gris", img: "img/no_temas_solo_ten_fe_/no_temas_solo_ten_fe_gris.png" },
            { nombre: "Azul", img: "img/no_temas_solo_ten_fe_/no_temas_solo_ten_fe_azul.png" }
        ]
    },
    { 
        id: 5, 
        nombre: "Hacia lo alto", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/hacia_lo_alto_/hacia_lo_alto_blanco.png" },
            { nombre: "Negro", img: "img/hacia_lo_alto_/hacia_lo_alto_negro.png" },
            { nombre: "Gris", img: "img/hacia_lo_alto_/hacia_lo_alto_gris.png" },
            { nombre: "Azul", img: "img/hacia_lo_alto_/hacia_lo_alto_azul.png" }
        ]
    },
    { 
        id: 6, 
        nombre: "En todo amar y servir", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/en_todo_amar_y_servir_/en_todo_amar_y_servir_blanco.png" },
            { nombre: "Negro", img: "img/en_todo_amar_y_servir_/en_todo_amar_y_servir_negro.png" },
            { nombre: "Gris", img: "img/en_todo_amar_y_servir_/en_todo_amar_y_servir_gris.png" },
            { nombre: "Azul", img: "img/en_todo_amar_y_servir_/en_todo_amar_y_servir_azul.png" }
        ]
    },
    { 
        id: 7, 
        nombre: "Resurrexit", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/resurrexit_/resurrexit_blanco.png" },
            { nombre: "Negro", img: "img/resurrexit_/resurrexit_negro.png" },
            { nombre: "Gris", img: "img/resurrexit_/resurrexit_gris.png" },
            { nombre: "Azul", img: "img/resurrexit_/resurrexit_azul.png" }
        ]
    },
    { 
        id: 8, 
        nombre: "No tengan miedo I", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/no_tengan_miedo_v1_/no_tengan_miedo_v1_blanco.png" },
            { nombre: "Negro", img: "img/no_tengan_miedo_v1_/no_tengan_miedo_v1_negro.png" },
            { nombre: "Gris", img: "img/no_tengan_miedo_v1_/no_tengan_miedo_v1_gris.png" },
            { nombre: "Azul", img: "img/no_tengan_miedo_v1_/no_tengan_miedo_v1_azul.png" }
        ]
    },
    { 
        id: 9, 
        nombre: "En el uno amarillo", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/en_el_uno_amarillo_/en_el_uno_amarillo_blanco.png" },
            { nombre: "Negro", img: "img/en_el_uno_amarillo_/en_el_uno_amarillo_negro.png" },
            { nombre: "Gris", img: "img/en_el_uno_amarillo_/en_el_uno_amarillo_gris.png" },
            { nombre: "Azul", img: "img/en_el_uno_amarillo_/en_el_uno_amarillo_azul.png" }
        ]
    },
    { 
        id: 10, 
        nombre: "Dios escribe derecho", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/dios_escribe_derecho_/dios_escribe_derecho_blanco.png" },
            { nombre: "Negro", img: "img/dios_escribe_derecho_/dios_escribe_derecho_negro.png" },
            { nombre: "Gris", img: "img/dios_escribe_derecho_/dios_escribe_derecho_gris.png" },
            { nombre: "Azul", img: "img/dios_escribe_derecho_/dios_escribe_derecho_azul.png" }
        ]
    },
    { 
        id: 11, 
        nombre: "Nunca copias", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/nunca_copias_/nunca_copias_blanco.png" },
            { nombre: "Gris", img: "img/nunca_copias_/nunca_copias_gris.png" },
            { nombre: "Azul", img: "img/nunca_copias_/nunca_copias_azul.png" }
        ]
    },
    { 
        id: 12, 
        nombre: "Autopista", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/autopista_/autopista_blanco.png" },
            { nombre: "Gris", img: "img/autopista_/autopista_gris.png" }
        ]
    },
    { 
        id: 13, 
        nombre: "Sean buenos", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/sean_buenos_/sean_buenos_blanco.png" },
            { nombre: "Negro", img: "img/sean_buenos_/sean_buenos_negro.png" },
            { nombre: "Gris", img: "img/sean_buenos_/sean_buenos_gris.png" },
            { nombre: "Azul", img: "img/sean_buenos_/sean_buenos_azul.png" }
        ]
    },
    { 
        id: 14, 
        nombre: "Confía en el proceso", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/confia_en_el_proceso_/confia_en_el_proceso_blanco.png" },
            { nombre: "Gris", img: "img/confia_en_el_proceso_/confia_en_el_proceso_gris.png" },
            { nombre: "Azul", img: "img/confia_en_el_proceso_/confia_en_el_proceso_azul.png" }
        ]
    },
    { 
        id: 15, 
        nombre: "Rex Regum", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/rex_regum_/rex_regum_blanco.png" },
            { nombre: "Negro", img: "img/rex_regum_/rex_regum_negro.png" },
            { nombre: "Azul", img: "img/rex_regum_/rex_regum_azul.png" }
        ]
    },
    { 
        id: 16, 
        nombre: "Valles de sombra", 
        precio: 25000, 
        colores: [
            { nombre: "Negro", img: "img/valles_de_sombra_/valles_de_sombra_negro.png" },
            { nombre: "Gris", img: "img/valles_de_sombra_/valles_de_sombra_gris.png" },
            { nombre: "Azul", img: "img/valles_de_sombra_/valles_de_sombra_azul.png" }
        ]
    },
    { 
        id: 17, 
        nombre: "Memento Mori", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/memento_mori_/memento_mori_blanco.png" },
            { nombre: "Negro", img: "img/memento_mori_/memento_mori_negro.png" },
            { nombre: "Gris", img: "img/memento_mori_/memento_mori_gris.png" },
            { nombre: "Azul", img: "img/memento_mori_/memento_mori_azul.png" }
        ]
    },
    { 
        id: 18, 
        nombre: "No tengan miedo II", 
        precio: 25000, 
        colores: [
            { nombre: "Blanco", img: "img/no_tengan_miedo_v2_/no_tengan_miedo_v2_blanco.png" },
            { nombre: "Negro", img: "img/no_tengan_miedo_v2_/no_tengan_miedo_v2_negro.png" },
            { nombre: "Gris", img: "img/no_tengan_miedo_v2_/no_tengan_miedo_v2_gris.png" },
            { nombre: "Azul", img: "img/no_tengan_miedo_v2_/no_tengan_miedo_v2_azul.png" }
        ]
    }
];