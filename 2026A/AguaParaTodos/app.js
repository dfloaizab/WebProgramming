const form = document.getElementById("reporteForm");
const botonVer = document.getElementById("verReportes");
const resultado = document.getElementById("resultado");

//========================================================
//   MANEJO DEL POST -ENVIAR REPORTE
//  DEBE DISPARARSE CUANDO SE DE CLICK EN EL BOTON SUBMIT
//========================================================

form.addEventListener("submit", async(e) => { 
    e.preventDefault();
    //Creamos un "registro tipo JSON para empacar la información":
    const reporte = {
        nombre: document.getElementById("nombre").value,
        tipo: document.getElementById("tipo").value,
        descripcion: document.getElementById("descripcion").value
    };
    resultado.innerHTML = "Enviando reporte...";
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/posts",   { 
            method: "POST",
            header: {
                "content-type":"application/json"
            },
            body: JSON.stringify(reporte)
         }    );

         const data = await response.json();

         //mostrar en consola, resultado de la petición:
         console.log("Respuesta del servidor...");
         console.log(data);

         //mostrar en la página, valores devueltos por el servidor:
         resultado.innerHTML = `
            <div class="bg-green-100 p-3 rounded-lg text-green-800">
                Reporte enviado correctamente <br>
                Id Asignado: ${data.id}
            </div>
         `;
         form.reset();

    }
    catch(error)
    {
        resultado.innerHTML = `
            <div class = "bg-red-100 p-3 rounded-lg text-red-800">
                Error al enviar el reporte.
            </div>
        `;
    }
 });


//=======================================================================
//   MANEJO DEL GET - OBTENER REPORTES DEL SERVIDOR Y MOSTRAR EN PANTALLA
//  DEBE DISPARARSE CUANDO SE DE CLICK EN EL BOTON VER REPORTES
//========================================================================

//botonVer.addEventListener("click",async(e) => {   });
