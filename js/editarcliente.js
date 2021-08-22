(function() {

    let DB;
    let idCliente;
    const nombreInput = document.getElementById( "nombre" );
    const emailInput = document.getElementById( "email" );
    const telefonoInput = document.getElementById( "telefono" );
    const empresaInput = document.getElementById( "empresa" );

    const formulario = document.getElementById( "formulario" );

    document.addEventListener( "DOMContentLoaded", () =>{

        conectarDB();

        formulario.addEventListener( "submit", actualizarCliente );


        //Verificar Id de la URL

        const parametrosURL = new URLSearchParams( window.location.search );
        
        idCliente = parametrosURL.get( 'id' );
        if( idCliente ) {
            
            setTimeout( () => {
                obtenerCliente( idCliente);
            }, 200 );
        }

    });

    function actualizarCliente( e ) {
        e.preventDefault();

        if( nombreInput.value === "" || emailInput === "" || telefonoInput === "" || empresaInput === "" ) {

            imprimirAlerta( "Todos los campos son obligatorios", "error" );

            return;

        }

        const clienteActualizdao = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: emailInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction( ['crm'], 'readwrite' );
        const objectStore = transaction.objectStore( "crm" );

        objectStore.put( clienteActualizdao );

        transaction.oncomplete = function() {
            imprimirAlerta( "Editado correctamente" );

            setTimeout( () => {
                window.location.href = "index.html";
            }, 3000);

        }

        transaction.onsuccess = function() {
            imprimirAlerta( "Hubo un error", 'error' );
        }
    }


    function obtenerCliente( id ) {

        const transaction = DB.transaction( [ 'crm' ], 'readonly' );
        const objectStore = transaction.objectStore( "crm" );

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function( e ) {
            const cursor = e.target.result;

            if( cursor ){
                if( cursor.value.id === Number( id ) ) {
                    llenarFormulario( cursor.value );
                }
                cursor.continue();
                
            }
        }

    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open( "crm", 1 );

        abrirConexion.onerror = function() {
            console.log( "Hubo un error" );
        };

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

    function llenarFormulario( datosCliente ) {

        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
})();