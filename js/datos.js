//https://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
const CLAVE = 'd7b58966e48d594fdc7fde3782331953';
var dias;
//Usar cookies para almacenar el ultimo tiempo si no hay conex. Si hay, se guarda.
//Detectar ubicación para cargar la página con el tiempo de la ubicación del usuario.

//obtener_tiempo('Madrid');

getLocation();
document.getElementById('btn_busqueda').addEventListener('click', on_busqueda);
document.getElementById('campo_busqueda').addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
    	on_busqueda(e);
    }
});

function on_busqueda(e) {
	e.preventDefault();
	obtener_tiempo(document.getElementById('campo_busqueda').value);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(tiempo_actual);
    } else {
        document.getElementById('contenedor_dias').innerHTML = "<p>Geolocation is not supported by this browser.</p>";
    }
}

function tiempo_actual(posicion) {
	var url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		posicion.coords.latitude + '&lon=' + posicion.coords.longitude +
		'&units=metric&appid=' + CLAVE;
		
	getJSON(url).then(on_tiempo, function(status) {
		console.log (status);
	});
}

/**
 * Función que permite hacer visibles las horas del día deseado.
 * Está pensada para reaccionar ante un clic sobre un día, por lo que
 * se obtiene la primera clase del elemento sobre el cual se puso el evento
 * (this), puesto que contendrá el índice del día.
 *
 * Además, hace scroll a la tabla donde se muestran los datos del día.
 * @param event e objeto del evento que ha provocado la invocación de la función.
 */
function mostrar_datos_dia(e) {
	mostrar_horas(dias[parseInt(this.className)]);
	scrollTo('tabla_dia');
}

/**
 * Función que permite mostrar todas las horas del día recibido por parámetro.
 */
function mostrar_horas(dia) {
	var editables = document.querySelectorAll('#tabla_dia .editable'),
		cabecera = editables[0], cuerpo = editables[1];
	//Se establece la fecha del día del cual se muestran las horas
	cabecera.innerHTML = dia.dia_semana + ', ' + dia.dia_mes + '/' + dia.mes + '/' + dia.anio;

	//Se vacía el cuerpo de la tabla
	cuerpo.innerHTML = '';

	//Se muestra cada una de las horas del día recibido por parámetro mediante la función mostrar_hora
	Array.prototype.forEach.call(dia.horas, (hora) => mostrar_hora(hora, cuerpo));
}

/**
 * Función encargada de insertar una fila relativa a la hora recibida
 * por parámetro, dentro del cuerpo de la tabla, el cual también es un parámetro.
 */
function mostrar_hora(hora, cuerpo) {
	//Se inserta el contenido al final del interior del contenedor (append)
	cuerpo.insertAdjacentHTML('beforeend',
		'<tr>' +
			'<td>' + hora.hora + '</td>' +
			'<td><img class="icono-tiempo" src="http://openweathermap.org/img/w/' + hora.cod_icono + '.png" alt="Icono del tiempo."></td>' +
			'<td>' + hora.temperatura + ' ºC</td>' +
			'<td>' + hora.viento + ' km/h</td>' +
			'<td>' + hora.humedad + ' %</td>' +
		'</tr>'
	);
}

/**
 * Función encargada de mostrar los datos de cada uno de los días recibidos por parámetro.
 * @param array dias array de días recibidos
 * @return {[type]}      [description]
 */
function mostrar_dias(dias) {
	var contenedor_dias = document.getElementById('contenedor_dias');
	contenedor_dias.innerHTML = '';
	//Por cada uno de los días se realiza la función mostrar_día.
	Array.prototype.forEach.call(dias, (dia, num_dia, arr) => 
		mostrar_dia(contenedor_dias, dia, num_dia));
}

/**
 * Función encargada de mostrar la información del día recibido por parámetro
 */
function mostrar_dia(contenedor, dia, num_dia) {
	//Se inserta el contenido al final del interior del contenedor (append)
	contenedor.insertAdjacentHTML('beforeend',
		'<div class="' + num_dia + ' contenedor-dia contenedor-sombreado">' + 
			'<div class="contenedor-tiempo">' + 
				'<span class="descripcion">' + dia.dia_semana + ', ' + dia.dia_mes + '/' + dia.mes + '/' + dia.anio + '</span><br>' +
			'</div>' + 
			'<div class="contenedor-datos">' + 
				'<img class="icono-tiempo" src="http://openweathermap.org/img/w/' + dia.cod_icono + '.png" alt="Icono del tiempo.">'+
				'<span class="descripcion">' + dia.descripcion + '</span>' +
				'<div class="contenedor-temperatura">' + 
					'<span class="temperatura">' + dia.temp + 'º C</span>' +
					'<span class="temperatura-max">' + dia.max_temp + 'º C</span>' +
					'<span class="temperatura-min">' + dia.min_temp + 'º C</span>' +
				'</div>' + 
				'<span class="velocidad-viento">' + dia.viento + 'km/h</span>' +
				'<span class="humedad">' + dia.humedad + '%</span>' +
			'</div>' + 
		'</div>'
	);	
}

/**
 * Función que permite realizar la media de la propiedad deseada de los objetos 
 * de tipo hora almacenados en el array recibido por parámetro. Al recibir la
 * propiedad por parámetro, no es necesaria más que esta función para cada una
 * de las propiedades.
 * 
 * @param  array tiempo_horas  Lista de objetos de tipo Hora de los cuales se
 * va a calcular la media.
 * @param  string propiedad    Nombre de la propiedad de cada objeto tipo Hora
 * de la cual se calcula la media.
 * @param  number num_decimales Número de decimales a dejar en el resultado.
 * @return Number               Número resultante de calcular la media de todas
 * las propiedades de los objetos recibidos por el parámetro tiempo_horas.
 */
function avg(tiempo_horas, propiedad, num_decimales) {
	//Obteniendo el índice de decimales 
	//(10 multiplicado tantas veces como decimales se deseen)
	var indice_decimales = Math.pow(10, num_decimales);

	//Se realiza una suma mediante una función flecha que recibe la función
	//reduce. El resultado se divide entre el número de horas para obtener la media.
	return eval('Math.round(indice_decimales * tiempo_horas.reduce(' +
		'(a, b) => ({' + propiedad + ': a.' + propiedad + ' + b.' + propiedad + '})' +
	').' + propiedad + ' / tiempo_horas.length) / indice_decimales');
}

/**
 * Función que devuelve la temperatura media, máxima o mínima
 * de todos los objetos de tipo Hora recibidos en el primer parámetro;
 * en función del último parámetro.
 * 
 * @param  array tiempo_horas  Lista de objetos de tipo Hora de los cuales se
 * va a calcular la media.
 * @param  number num_decimales Número de decimales a dejar en el resultado.
 * @param  string funcion    Nombre de la funcion a aplicar a cada objeto tipo Hora
 * con la cual se calcula la temperatura mínima (min), máxima (max) o
 * media (nada recibido por parámetro).
 * @return Number               Número resultante de calcular la media de todas
 * las propiedades de los objetos recibidos por el parámetro tiempo_horas.
 */
function temperatura(tiempo_horas, num_decimales, funcion) {
	//Obteniendo el índice de decimales 
	//(10 multiplicado tantas veces como decimales se deseen)
	var indice_decimales = Math.pow(10, num_decimales);
	if (funcion == undefined) { // Si no se recibe ningún  parámetro función
		//Se devuelve la media de las temperaturas
		return avg(tiempo_horas, 'temperatura', 2);
	}
	//Se aplica la funcion mino max.
	return eval('Math.round((indice_decimales * Math.' + funcion + '.apply(' +
		'Math, tiempo_horas.map((tiempo_hora) => tiempo_hora.temperatura_max )))' +
	') / indice_decimales');
}

/**
 * Función encargada de generar una lista de objetos de tipo Dia a partir de
 * los datos recibidos del por parámetro.
 * La temperatura del primer día es la primera de ese mismo, puesto que el servicio web
 * devuelve como primera hora de tiempo como la más cercana a la actual.
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function obtener_dias(data) {
	var dias = [], horas = [], dia = new Date().getDate();

	for (let tiempo_hora of data.list) { // Iterando la lista de horas
		let fecha = new Date(tiempo_hora.dt_txt),
			timestamp = fecha.getHours() + ':' + fecha.getMinutes() + '0', 
			dia_actual = fecha.getDate();

		//Añadiendo un nuevo objeto de tipo Hora con los datos de la hora iterada
		horas.push(new Hora(
			timestamp, 
			tiempo_hora.main.temp,
			tiempo_hora.main.temp_min,
			tiempo_hora.main.temp_max,
			tiempo_hora.main.humidity,
			tiempo_hora.weather[0].icon,
			tiempo_hora.weather[0].description,
			tiempo_hora.wind.speed
		));

		// Si el día de la hora iterada es distinto del actual, se crea un
		// objeto día con las horas iteradas anteriores
		if (dia !== dia_actual) {
			fecha.setDate(dia);

			//Añadiendo un día a la lista de días
			dias.push(new Dia(
				dia_semana(fecha.getDay()),
				fecha.getDate(),
				fecha.getMonth() + 1,
				fecha.getFullYear(),
				horas[0].cod_icono,
				horas[0].descripcion,
				temperatura(horas, 2, 'max'), // Se extrae la temperatura máxima
				temperatura(horas, 2, 'min'), // Se extrae la temperatura mínima
				//Se muestra la primera temperatura o se calcula la temperatura media
				(dias.length === 0) ? horas[0].temperatura : temperatura(horas, 2),
				avg(horas, 'humedad', 2), // Se calcula la humedad media
				avg(horas, 'viento', 2), // Se calcula la velocidad media
				horas // Lista de horas pertenecientes al día
			));

			// El día  referido al siguiente objeto de tipo día a almacenar
			// pasa a ser el día iterado
			dia = dia_actual;

			// Se reestablece la lista de horas para el siguiente objeto de
			// tipo día
			horas = [];
		}
	}

	return dias;
}

/**
 * Función que devuelve el día de la semana en función del índice.
 * El primer elemento (cuyo índice es 0), es el Domingo.
 */
function dia_semana(dia) {
	return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dia];
}

/**
 * Función encargada de realizar la petición al servicio web del tiempo.
 * Una vez se recibe una respuesta cuyo estado es correcto, se procede a 
 * extraer la información de cada uno de los días y a mostrarse en el DOM.
 * También se establecen los listeners para cada uno de los días, de manera
 * que en cuanto se haga clic sobre ellos se muestre la información de sus horas
 * en una tabla.
 * @param  string ciudad La ciudad de la que se desea obtener la información
 * sobre el tiempo.
 */
function obtener_tiempo(ciudad) {
	var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + ciudad + '&units=metric&appid=' + CLAVE;

	//Realizando la petición al servicio web.
	getJSON(url).then(on_tiempo, function(status) {
		console.log (status);
	});
}

function on_tiempo(data) {
	dias = obtener_dias(data);
	mostrar_dias(dias);
	mostrar_horas(dias[0]);

	//Estableciendo listeners a cada uno de los días
	Array.prototype.forEach.call(document.getElementsByClassName('contenedor-dia'),
		(element) => element.addEventListener('click', mostrar_datos_dia));
}

/**
 * Función que realiza una petición a una URL mediante
 * el objeto XMLHttpRequest en formato JSON, de manera
 * que se puedan extraer los datos del tiempo.
 * @param  string url La dirección URL de la cual se obtienen los datos.
 */
function getJSON(url) {
	return new Promise(function(resolve, reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('get', url, true);
	    xhr.responseType = 'json';

	    xhr.onload = function() {
	      var status = xhr.status;
	      if (status == 200) {
	        resolve(xhr.response);
	      } else {
	        reject(status);
	      }
	    };
	    
	    xhr.send();
  	});
}