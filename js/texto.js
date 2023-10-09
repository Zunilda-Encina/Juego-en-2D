//Inicializo el juego
var juego = new Phaser.Game(600, 350, Phaser.CANVAS, '', { preload: preload, create: create, update: update });


let texto;
let texto2;
let texto3;
let hud;

let barraEspacio;

const stringNumeros = "0123456789X";
//Se ejecuta una vez, precarga los assets a usar en el juego
function preload() {
    juego.load.image('fondo', 'imagenes/Pampa/fondo.png');
}

//Se ejecuta una vez, crea los componentes del juego
function create() {
    juego.add.image(0, 0, 'fondo');

    hud = juego.add.group();

    hud.position.set(300, 100);

    let texto = juego.add.text(0, 0, 'EXCELENTE');

    texto2 = juego.add.text(0, 40, 'Texto con Estilo', { fontSize: '42px', fill: '#e5d107', strokeThickness: 2.5, stroke: '#FFFFFF' });

    texto3 = juego.add.text(0, 100, 'Texto con demasiado Estilo', { fontSize: '44px', fill: '#e5d107', strokeThickness: 4, stroke: '#FF0000', fontStyle: 'italic', backgroundColor: '#00FF00' });

    texto.anchor.set(0.5, 0.5);
    texto2.anchor.set(0.5, 0.5);
    texto3.anchor.set(0.5, 0.5);

    hud.add(texto3);
    hud.add(texto2);
    hud.add(texto);

    fondo = juego.add.image(0, 0, "fondo");
    setInterval(function() {
        moverLogo(fondo);
    }, 1000);
}

//Se ejecuta constantemente, actualiza valores
function update() {}

function moverLogo(logo) {
    logo.targets = fondo;
    logo.position.y += 450;
    logo.yoyo = true;
    logo.loop = -1;
    // logo = {
    //     targets: fuego,
    //     y: 450,
    //     duration: 2000, //milisegundos
    //     yoyo: true,
    //     loop: -1
    // };
}