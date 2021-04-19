

module.exports = {
    makeid, randomWord
  }
  
  function makeid(length) {
     /*var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;*/
     return (Math.floor(Math.random()*9000+1000)).toString()
  }

  function randomWord(){
     let idx =Math.floor(Math.random()*wordsI.length);
     return wordsI[idx];
  }

  wordsI = [
   'ANGEL', 
   'OJO', 
   'PIZZA', 
   'ENOJADO', 
   'FUEGOS ARTIFICIALES', 
   'CALABAZA', 
   'BEBE', 
   'FLOR', 
   'ARCO IRIS', 
   'BARBA', 
   'PLATILLO VOLADOR', 
   'RECICLAR', 
   'BIBLIA', 
   'JIRAFA', 
   'CASTILLO DE ARENA', 
   'BIKINI', 
   'GAFAS', 
   'COPO DE NIEVE', 
   'LIBRO', 
   'TACON', 
   'ESCALERA', 
   'HELADO', 
   'ESTRELLA DE MAR', 
   'ABEJORRO', 
   'IGLU', 
   'FRESA', 
   'MARIPOSA', 
   'ESCARABAJO', 
   'SOL', 
   'CAMARA', 
   'LAMPARA', 
   'NEUMATICO', 
   'GATO', 
   'LEON', 
   'TOSTADA', 
   'IGLESIA', 
   'BUZON', 
   'CEPILLO DE DIENTES', 
   'COLOR', 
   'NOCHE', 
   'PASTA DENTAL', 
   'DELFIN', 
   'NARIZ', 
   'CAMION', 
   'HUEVO', 
   'JUEGOS OLIMPICOS', 
   'VOLEIBOL', 
   'TORRE EIFFEL', 
   'MANI', 
   'BESO', 
   'CEREBRO', 
   'CACHORRO', 
   'PATIO', 
   'BURBUJAS', 
   'CALABAZA', 
   'HEBILLA', 
   'LABIAL', 
   'GOTA', 
   'AUTOBUS', 
   'LANGOSTA', 
   'ROBOT', 
   'CHUPETE', 
   'CASTILLO DE ARENA', 
   'IMAN', 
   'ZAPATILLA', 
   'MEGAFONO', 
   'BOLA DE NIEVE', 
   'SIRENA', 
   'COMPUTADORA', 
   'ESTATUA DE LA LIBERTAD', 
   'CUNA', 
   'MONTE EVEREST', 
   'RENACUAJO', 
   'DRAGON', 
   'MUSICA', 
   'CAMPAMENTO', 
   'PESA', 
   'POLO NORTE', 
   'TELESCOPIO', 
   'ANGUILA', 
   'ENFERMERA', 
   'TREN', 
   'RUEDA', 
   'BUHO', 
   'TRICICLO', 
   'BANDERA', 
   'CHUPETE', 
   'TUTU', 
   'CORREO', 
   'PIANO', 
   'ATICO', 
   'PEGAMENTO', 
   'RELOJ', 
   'TRASERO', 
   'SILLA', 
   'ROCK', 
   'MEXICO', 
   'CUMPLEANOS', 
   'HOCKEY', 
   'PIEGRANDE', 
   'CALABOZO', 
   'HOTEL', 
   'HUEVOS', 
   'TORMENTA', 
   'CUERDA', 
   'CINTURON', 
   'BURRITO', 
   'KOALA', 
   'IGNORAR', 
   'CAPITAN', 
   'DUENDE', 
   'ECLIPSE', 
   'CANDELABRO', 
   'RAPIDO', 
   'ESPACIO', 
   'CUNA', 
   'MASCARA', 
   'ESTETOSCOPIO', 
   'CRUCERO', 
   'MECANICO', 
   'CIGUENA', 
   'BAILE', 
   'MAMA', 
   'BRONCEADO', 
   'DESODORANTE', 
   'PAPA', 
   'HILO', 
   'FACEBOOK', 
   'SATURNO', 
   'TURISTA', 
   'PLANO', 
   'PLATO', 
   'ESTADOS UNIDOS', 
   'MARCO', 
   'FOTO', 
   'WIFI', 
   'LUNA LLENA', 
   'MONJA', 
   'ZOMBI', 
   'JUEGO', 
   'PIRATA', 
   'CASCADA', 
   'MAR', 
   'PANTALLA', 
   'TELEFONO', 
   'CORTINA', 
   'BICICLETA', 
   'CAMA', 
   'CINE', 
   'BARRIL', 
   'RIO', 
   'ARBOL', 
   'BOSQUE', 
   'OSO PANDA', 
   'LAMPARA',
   'BOMBILLA',
   'TERMO',
   'MAPA',
   'TRONCO',
   'CANASTA',
   'ENFERMO',
   'PARLANTE',
   'MATEMATICA',
   'CLOSET',
   'PORTERO',
   'ARQUERIA',
   'GUANTE',
   'ENOJADO',
   'COLOMBIA',
   'AVION',
   'VACA',
   'LORO',
   'HUESO', 
   'ESQUELETO',
   'MANGO',
   'BILLETE',
   'CABELLO',
   'CABALLO',
   'CANTANTE',
   'INFINITO',
   'TRIGO',
   'GRANERO',
   'COSTA',
   'CAJON',
   'AVE',
   'IGUANA',
   'TEJADO',
   'CONECTOR',
   'UNIVERSIDAD',
   'ESTADIO',
   'PASILLO',
   'PLANO',
   'INGENIERO',
   'CARACOL',
   'RADIO',
   'MAQUINA',
   'SUPERMERCADO',
   'VIDEO',
   'CINE',
   'PAPEL',
   'GRANA',
   'NEVERA',
   'GUITARRA',
   'ISLA',
   'CERVEZA',
   'METRO',
   'TABLA',
   'DIENTES',
   'LENTES',
   'BOTE',
   'AGUACATE',
   'CAMA',
   'TOALLA',
   'QUIMICA',
   'CIENCIA',
   'ELECTRICIDAD',
   'CAMPO',
   'IMAN',
   'GRAVEDAD',
   'BATERIA',
   'UNIVERSO',
   'AREPA',
   'FACEBOOK',
   'CABLE',
   'CELULAR',
   'PANEL',
   'HUECO',
   'SOSPECHOSO',
   'ESCUADRA',
   'FUEGO',
   'CALCULADORA',
   'MICROFONO',
   'PESTAÑA',
   'ESTACION DE BOMBEROS',
   'MADERA',
   'BICHO',
   'MAMA',
   'BIGOTE',
   'PAN',
   'PARIS',
   'AFRICA',
   'AMERICA',
   'ASIA',
   'EUROPA',
   'PACIFICO',
   'GRILLO',
   'HILO',
   'CUADERNO',
   'NOTA',
   'SISTEMA',
   'METAL',
   'ESCRITORIO',
   'COBIJA',
   'VIRUS',
   'ERROR',
   'PANTALLA',
   'COMIDA',
   'PERICO',
   'ESCORPION',
   'ESCUDO',
   'FUTBOL',
   'LEON',
   'WEB',
   'CONJUNTO',
   'ESTADISTICA',
   'DADO',
   'RATON',
   'CUERDA', 
   'PELUCHE',
   'OMBLIGO',
   'EDIFICIO',
   'GENIO',
   'CORAZON',
   'CONCHA',
   'TELARAÑA',
   'RED',
   'LABIOS',
   'GARRA',
   'LIMPIO',
   'SUCIO',
   'LUZ',
   'TUBO',
   'PIE',
   'CAMISA',
   'SANGRE',
   'MONSTRUO',
   'CIELO',
   'CIGARRILLO',
   'PIMIENTO',
   'ENSALADA',
   'ASADO',
   'MALVAVISCOS',
   'CASCO',
   'GOLPE',
   'PAREJA',
   'FELIZ',
   'DIENTES',
   'YUCA',
   'MENSAJE',
   'SONIDO',
   'ESTUFA',
   'FLECHA',
   'ARCO',
   'PIEDRA',



   ]