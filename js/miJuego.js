//instanciamos la clase phaser ancho, alto, renderizado, id
let juego = new Phaser.Game(960, 600, Phaser.CANVAS, ' ',

    //funciones principales o nativas del phaser
    { preload: preload, create: create, update: update });

//declaramos variables en un objeto para usar en el juego
const jugadorStats = {
    puntaje: 0,
    vidas: 3,
    salto: 300,
    rebote: 200,
    velocidad: 300,
    jugadorTieneLlave: false
};
 let nivelActual= 0;
//Interfaz
let imagenPuntaje, imagenVidas, iconoLlave, puntajeFuente, vidasFuente,
    iconoPickup, iconoVidas, hud;
let objetivo, puerta;
const GRAVEDAD = 300;
const VELOCIDADENEMIGO = 200;
const stringNumeros = "0123456789X";
let plataformas, jugador, enemigos, fuego, cursores, pickups, paredesInvisibles;

//sonido
let musica;

let sonidoSalto;
let sonidoMoneda;
let sonidoMuerte;
let sonidoLlave;
let sonidoPuerta;

//declarar funciones palabra reservada nombreFuncion 

function preload() {
     
    //pre cargamos nuestro recursos 
    juego.load.image('fondo', 'imagenes/Norte/paisajes.png');
    juego.load.image('piso', 'imagenes/Pampa/piso.png');
    juego.load.image('plata_8x1', 'imagenes/Norte/plataforma_8x1.png');
    juego.load.image('plata_6x1', 'imagenes/Norte/plataforma_6x1.png');
    juego.load.image('plata_4x1', 'imagenes/Norte/plataforma_4x1.png');
    juego.load.image('plata_2x1', 'imagenes/Norte/plataforma_2x1.png');
    juego.load.image('plata_1x1', 'imagenes/Norte/plataforma_1x1.png');
    juego.load.spritesheet('jugador', 'imagenes/Pampa/jugadora_f.png', 33, 49);
    juego.load.spritesheet('pickup', 'imagenes/Pampa/pickup.png', 33, 38);
    juego.load.spritesheet('fuego', 'imagenes/Pampa/fuego.png', 34, 52);
    juego.load.spritesheet('enemigo', 'imagenes/Pampa/enemigo.png', 63, 33);
    juego.load.image('pared-invisible', 'imagenes/Pampa/pared_invisible.png');
    juego.load.image('monedaIcono', 'imagenes/Pampa/icono_pickup.png');
    juego.load.image('vidaIcono', 'imagenes/Pampa/icono_jugadora_f.png');
    juego.load.spritesheet('iconoLlave', 'imagenes/Pampa/icono_objetivo.png', 52, 39);
    juego.load.image('puntajeFuente', 'imagenes/numeros.png');
    juego.load.spritesheet('puerta', 'imagenes/Pampa/puerta.png', 40, 66);
    juego.load.spritesheet('objetivo', 'imagenes/Pampa/objetivo.png', 64, 61);

    //musica
    juego.load.audio('musicaFondo',  'audio/superM.mp3');

    //sonido
    juego.load.audio('sonidoSalto','audio/saltar.wav');
    juego.load.audio('sonidoMoneda','audio/moneda.wav');
    juego.load.audio('sonidoMuerte','audio/muerte.wav');
    juego.load.audio('sonidoLlave','audio/llave.wav');
    juego.load.audio('sonidoPuerta','audio/puerta.wav');
    

}
function create() {
    juego.add.image(0, 0, 'fondo');
    if (nivelActual == 0){

    //agregamos la física al juego
    juego.physics.startSystem(Phaser.Physics.ARCADE);

    //agregar la gravedad
    juego.physics.arcade.gravity.y = GRAVEDAD;

    //puerta
    puerta = juego.add.sprite(169, 546, 'puerta');

    //Sonidos
    musica = juego.add.audio('musicaFondo');
    musica.loop = true;
    musica.play();

    sonidoSalto = juego.add.audio('sonidoSalto');
    sonidoMoneda = juego.add.audio('sonidoMoneda');
    sonidoMuerte = juego.add.audio('sonidoMuerte');
    sonidoLlave = juego.add.audio('sonidoLlave');
    sonidoPuerta = juego.add.audio('sonidoPuerta');

    puerta.anchor.set(0.5, 1);
    juego.physics.enable(puerta);
    puerta.animations.add('cerrada', [0]);
    puerta.animations.add('abierta', [1]);
    puerta.animations.play('cerrada');

    fijarEnLugar(puerta);

    objetivo = juego.add.sprite(850, 53, 'objetivo');
    objetivo.anchor.set(0.5, 0.5);
    objetivo.animations.add('tranquila', [0, 1], 2, true);
    objetivo.animations.play('tranquila');
    juego.physics.arcade.enable(objetivo);
    fijarEnLugar(objetivo);

    plataformas = juego.add.group();
    plataformas.enableBody = true;

    let piso = plataformas.create(0, 546, 'piso');
    let plat8A = plataformas.create(0, 420, 'plata_8x1');
    let plat8B = plataformas.create(672, 378, 'plata_8x1');
    let plat6A = plataformas.create(462, 167, 'plata_6x1');
    let plat4A = plataformas.create(126, 252, 'plata_4x1');
    let plat2A = plataformas.create(420, 336, 'plata_2x1');
    let plat2B = plataformas.create(789, 84, 'plata_2x1');
    let plat1A = plataformas.create(588, 504, 'plata_1x1');
    paredesInvisibles = juego.add.group();
    paredesInvisibles.enableBody = true;
    paredesInvisibles.visible = false;

    for (let n = 0; n < plataformas.children.length; n++) {
        let elemento = plataformas.children[n];
        fijarEnLugar(elemento);
        crearParedInvisible(elemento.x, elemento.y, 'izq');
        crearParedInvisible(elemento.x + elemento.width, elemento.y, 'der');
    }
    jugador = juego.add.sprite(21, 485, 'jugador');
    juego.physics.arcade.enable(jugador);
    jugador.body.collideWorldBounds = true;
    cursores = juego.input.keyboard.createCursorKeys();

    //animaciones
    jugador.animations.add('ocioso', [0]);
    jugador.animations.add('correr', [1, 2], 8, true);
    jugador.animations.add('saltar', [3]);
    jugador.animations.add('caer', [4]);
    pickups = juego.add.group();
    pickups.enableBody = true;

    let coordX = [250, 310, 360, 420, 720, 770, 820, 870, 399, 357, 336, 189, 231, 525, 580, 640];
    let coordY = [524, 524, 524, 524, 524, 524, 524, 524, 294, 315, 357, 231, 231, 147, 147, 147];

    for (let a = 0; a < coordX.length; a++) {
        let obj = pickups.create(coordX[a], coordY[a], 'pickup');
        fijarEnLugar(obj);
        obj.animations.add('rotar', [0, 1, 2, 3], 6, true);
        obj.play('rotar');
        obj.anchor.set(0.5, 0.5);
    }

    cursores.up.onDown.add(saltar, this);

    //instanciamos el fuego
    fuego = juego.add.sprite(465, 285, 'fuego');
    fuego.animations.add('ja', [0, 1, 2], 6, true);
    fuego.animations.play('ja');
    juego.physics.arcade.enable(fuego);
    fijarEnLugar(fuego);

    //creamos el grupo de los enemigos
    enemigos = juego.add.group();
    enemigos.enableBody = true;
    enemigos.create(121, 399, 'enemigo');
    enemigos.create(500, 147, 'enemigo');
    enemigos.create(800, 362, 'enemigo');

    for (let i = 0; i < enemigos.children.length; i++) {
        let ene = enemigos.children[i];
        ene.anchor.set(0.5, 0.5);
        ene.animations.add('mover', [0, 1, 2], 8, true);
        ene.animations.add('morir', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        ene.animations.play('mover');
        ene.body.collideWorldBounds = true;
        ene.body.velocity.x = 200;
    }
    hud = juego.add.group();
    hud.position.set(10, 10);
    iconoLlave = hud.create(0, 19, 'iconoLlave');
    iconoLlave.anchor.set(0, 0.5);
    iconoPickup = hud.create(iconoLlave.width + iconoLlave.position.x, iconoLlave.height / 2,
        'monedaIcono');

    iconoPickup.anchor.set(0, 0.5);
    iconoVidas = hud.create(0, iconoPickup.height + iconoPickup.position.y, 'vidaIcono');
    iconoVidas.anchor.set(0, 0.5);

    //retrofont para los 2 textos
    puntajeFuente = juego.add.retroFont('puntajeFuente', 20, 26, stringNumeros, 6);
    vidasFuente = juego.add.retroFont('puntajeFuente', 20, 26, stringNumeros, 6);

    //creamos las imagenes como texto
    imagenPuntaje = hud.create(iconoPickup.x + iconoPickup.width,
        iconoPickup.position.y, puntajeFuente);
    imagenPuntaje.anchor.set(0, 0.5);
    imagenVidas = hud.create(iconoVidas.x + iconoVidas.width,
        iconoVidas.position.y, vidasFuente);
    imagenVidas.anchor.set(0, 0.5);
    puntajeFuente.text = 'x' + jugadorStats.puntaje;
    vidasFuente.text = 'x' + jugadorStats.vidas;

    }else if(nivelActual==1){
        //acá va el otro nivel
        fuego = juego.add.sprite(465, 285, 'fuego');


    }
}

function update() {
     if(nivelActual==0){
    juego.physics.arcade.collide(jugador, plataformas);
    juego.physics.arcade.overlap(jugador, pickups, jugadorConPickups, null, this);
    juego.physics.arcade.overlap(jugador, fuego, jugadorConFuego, null, this);
    juego.physics.arcade.collide(enemigos, plataformas);
    juego.physics.arcade.collide(enemigos, paredesInvisibles);
    juego.physics.arcade.overlap(jugador, enemigos, jugadorConEnemigo, null, this);
    juego.physics.arcade.overlap(jugador, objetivo, jugadorConObjetivo);
    if(jugadorStats.puntaje >=46 && jugadorStats.jugadorTieneLlave==true) {
    juego.physics.arcade.overlap(jugador, puerta, jugadorConPuerta);

    }

    if (cursores.right.isDown) {
        mover(1);

    } else if (cursores.left.isDown) {
        mover(-1);

    } else {
        jugador.body.velocity.x = 0;
        jugador.animations.play('ocioso');
    }
    if (jugador.body.touching.down &&
        jugador.body.velocity.x != 0) {
        jugador.animations.play('correr');

    } else if (!jugador.body.touching.down &&
        jugador.body.velocity.y < 0) {
        jugador.animations.play('saltar');

    } else if (!jugador.body.touching.down &&
        jugador.body.velocity.y >= 0) {
        jugador.animations.play('caer');
    }
    for (let i = 0; i < enemigos.children.length; i++) {
        let ene = enemigos.children[i];
        if (ene.body.touching.right || ene.body.blocked.right) {
            ene.body.velocity.x = -VELOCIDADENEMIGO;
            ene.scale.x = -1;

        } else if (ene.body.touching.left || ene.body.blocked.left) {
            ene.body.velocity.x = VELOCIDADENEMIGO;
            ene.scale.x = 1;
        }
    }

}

}

function aleatorio() {
    let numero = Math.floor(Math.random() * 18);
    alert(numero);
}

function fijarEnLugar(obj) {
    obj.body.moves = false;
    obj.body.immovable = true;

}

function mover(direccion) {
    jugador.body.velocity.x =
        jugadorStats.velocidad * direccion;

}

function saltar() {
    if (jugador.body.touching.down) {
        sonidoSalto.play();
        jugador.body.velocity.y = -jugadorStats.salto;
    }
}

function jugadorConPickups(jugador, pickup) {
    pickup.kill();
    sonidoMoneda.play();
    jugadorStats.puntaje++;
    puntajeFuente.text = 'x' + jugadorStats.puntaje;
}

function jugadorConFuego(jugador, fuego) {
    matarJugador();
}

function matarJugador() {
    jugadorStats.vidas--;
    if (jugadorStats.vidas == 0) {
        jugadorStats.vidas = 3;
        jugadorStats.puntaje = 0;
        juego.state.restart();
    } else {
        jugador.position.set(21, 285);
        vidasFuente.text = 'x' + jugadorStats.vidas;
    }
}

function crearParedInvisible(x, y, lado) {
    let pared = paredesInvisibles.create(x, y, 'pared-invisible');
    pared.anchor.set(lado === 'izq' ? 1 : 0, 1);
    fijarEnLugar(pared);
}

function jugadorConEnemigo(jugador, enemigos) {
    if (jugador.body.velocity.y > 0) {
        sonidoMuerte.play();
        enemigos.body.enable = false;
        enemigos.animations.play('morir').onComplete.addOnce(function() {
            enemigos.kill();
            jugadorStats.puntaje += 10;
            puntajeFuente.text = 'x' + jugadorStats.puntaje;
        }, this);
        jugador.body.velocity.y = -jugadorStats.rebote;
    } else {
        matarJugador();
    }
}
function jugadorConObjetivo(jugador,objetivo){
    if(jugadorStats.puntaje==46){
        objetivo.kill();
        jugadorStats.jugadorTieneLlave= true;
        puerta.frame = 1;

    }
}
function jugadorConPuerta(){
    nivelActual=1;
    sonidoPuerta.play();
        juego.state.restart();

}