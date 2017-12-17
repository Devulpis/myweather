function Dia (dia_semana, dia_mes, mes, anio, cod_icono, descripcion, max_temp,
	min_temp, temp, humedad, viento, horas) {
	this.dia_semana = dia_semana;
	this.dia_mes = dia_mes;
	this.mes = mes;
	this.anio = anio;
	this.cod_icono = cod_icono;
	this.descripcion = descripcion;
	this.max_temp = max_temp;
	this.min_temp = min_temp;
	this.temp = temp;
	this.humedad = humedad;
	this.viento = viento;
	this.horas = horas;
}

function Hora (hora, temperatura, temperatura_min, temperatura_max, humedad,
	cod_icono, descripcion, velocidad_viento) {
	this.hora = hora;
	this.temperatura = temperatura;
	this.temperatura_min = temperatura_min;
	this.temperatura_max = temperatura_max;
	this.humedad = humedad;
	this.cod_icono = cod_icono;
	this.descripcion = descripcion;
	this.viento = velocidad_viento;
}