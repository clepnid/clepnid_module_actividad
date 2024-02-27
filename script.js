function compararFechas(fechaActividad) {
  // Obtener la fecha actual
  var fechaActual = new Date();

  // Convertir la fecha de la actividad a un objeto Date
  var fechaActividadObj = new Date(fechaActividad);

  // Calcular la diferencia en milisegundos entre las dos fechas
  var diferencia = fechaActual.getTime() - fechaActividadObj.getTime();

  // Convertir la diferencia de milisegundos a horas
  var diferenciaEnHoras = diferencia / (1000 * 3600);

  // Comparar las fechas
  if (diferenciaEnHoras < 1) {
    return "Ahora";
  } else if (diferenciaEnHoras < 24) {
    return Math.floor(diferenciaEnHoras) + "h";
  } else if (diferenciaEnHoras < 48) {
    return "Ayer";
  } else {
    return Math.floor(diferenciaEnHoras / 24) + "d";
  }
}

function agregarLista(data){
  // Obtener el elemento ul
  var ul = document.getElementById("actividades-lista");
ul.innerHTML = ""; // Limpiar el contenido del elemento ul
      // Ordenar los datos por fechaHora de forma descendente
      data.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

      // Verificar si data está vacío
      if (data.length === 0) {
        var li = document.createElement("li");
        li.textContent = "admin ha eliminado registro actividad";
        ul.appendChild(li);
      } else {
        // Iterar sobre los datos y crear elementos de lista
        data.forEach(function(actividad) {
          var li = document.createElement("li");
          li.innerHTML = '<span class="usuario">' + actividad.usuario+'  -  ' + '</span>' + '<span class="nombre">' + actividad.nombre + '</span>' + ' - <span class="fechaHora">' + actividad.fechaHora + '</span>';
        
          // Crear una lista para las actividades de esta actividad
          var ulActividades = document.createElement("ul");
          ulActividades.classList.add("hijoActividad"); // Agregar la clase hijoActividad
        
          // Verificar si listaActividad está vacía
          if (actividad.listaActividad.length === 0) {
            // Si está vacía, añadir una actividad con una cadena de texto vacía
            var liActividad = document.createElement("li");
            liActividad.innerHTML = '<span class="actividadItem">' + '' + '</span>' + '<span class="diasPasados">' + compararFechas(actividad.fechaHora) + '</span>';
            ulActividades.appendChild(liActividad);
          } else {
            // Si no está vacía, iterar sobre las actividades y crear elementos de lista para cada una
            actividad.listaActividad.forEach(function(actividadItem) {
              var liActividad = document.createElement("li");
              liActividad.innerHTML = '<span class="actividadItem">' + actividadItem + '</span>' + '<span class="diasPasados">' + compararFechas(actividad.fechaHora) + '</span>';
              ulActividades.appendChild(liActividad);
            });
          }
        
          // Agregar la lista de actividades como hijo del elemento principal
          li.appendChild(ulActividades);
        
          // Agregar el elemento principal a la lista principal
          ul.appendChild(li);
        });
      }
}

document.addEventListener("DOMContentLoaded", function() {
  const selectElement = document.getElementById("sistema-select");

// Event listener para el cambio en el select
  selectElement.addEventListener("change", function() {
    const selectedOption = this.options[this.selectedIndex];
    const actividad = selectedOption.value;
    if(actividad==="Sistema"){
// Hacer una solicitud HTTP GET a la URL
  fetch('/actividades')
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data => {
      agregarLista(data);
    })
    .catch(error => console.error('Error al obtener los datos:', error)); // Manejar errores si la solicitud falla
  
}else{

    fetch(`/actividades/Consola/${actividad}`)
      .then(response => response.json())
      .then(data => {
      agregarLista(data);
      })
      .catch(error => {
        console.error(`Error al obtener la actividad ${actividad}:`, error);
      });
}
  });

//anyadir elementos a select
  
  fetch('/actividades/ConsolaActividades')
    .then(response => response.json())
    .then(data => {
      // Iterar sobre los datos recibidos y agregar cada uno como una opción
      data.forEach(actividad => {
	console.log(actividad);
        const option = document.createElement("option");
        option.value = actividad; 
        option.textContent = actividad; 
        selectElement.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al obtener las actividades:', error);
    });

  // Hacer una solicitud HTTP GET a la URL
  fetch('/actividades')
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data => {
      agregarLista(data);
    })
    .catch(error => console.error('Error al obtener los datos:', error)); // Manejar errores si la solicitud falla
  
});

