(function() {

    const formulario = document.getElementById( "formulario" );

    document.addEventListener( "DOMContentLoaded", () =>{

        conectarDB();

        formulario.addEventListener( "submit", validarCliente );
    })

    


    function validarCliente( e ){
        e.preventDefault();
        

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const empresa = document.getElementById("empresa").value;

        if( nombre === "" || email === "" || telefono === "" || empresa === "" ) {

            imprimirAlerta( "Todos los campos son obligatorios", "error" );
            return;

        }

        //Crear un objecto con la información

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        crearNuevoCliente( cliente ); 
    }

    function crearNuevoCliente( cliente ) {
        const transaction = DB.transaction( ['crm'], 'readwrite' );

        const objectStore = transaction.objectStore( "crm" );

        objectStore.add( cliente );

        transaction.onerror = function() {
            imprimirAlerta( "hubo un error", "error" );
        }
        transaction.oncomplete = function (){
            imprimirAlerta( "Cliente agregado correctamente" );

            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
    } 

    

})();