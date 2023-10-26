$(document).ready(function() {   
    let url = 'http://localhost:3000/proveedores/';
    let opcion = null;
    let codigo, nombre, direccion, telefono, correo, descripcion, estado, fila;

    // MOSTRAR
    let tablaProveedor = $('#TablaProv').DataTable({            
        "ajax":{
            "url": url,
            "dataSrc":""
        },
        "columns":[
            {"data":"codigo"},
            {"data":"nombre"},
            {"data":"direccion"},
            {"data":"telefono"},
            {"data":"correo"},
            {"data":"descripcion"},
            {"data":"estado"},
            {"defaultContent": "<div classclass='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"}
        ],
        "columnDefs":[{
            "targets":[6],
            render(v){
                return Number(v).toFixed(3);
            }
        }]              
    });

    // CREAR
    $("#btnCrear").click(function(){
        opcion='crear';            
        codigo=null;
        $("#formTallas").trigger("reset");
        $(".modal-header").css("background-color", "#23272b");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Crear Proveedor");
        $('#modalCRUD').modal('show');	    
    });    

    // EDITAR        
    $(document).on("click", ".btnEditar", function(){		            
        opcion='editar';
        fila = $(this).closest("tr");	        
        codigo = parseInt(fila.find('td:eq(0)').text());
        nombre = fila.find('td:eq(1)').text();
        direccion = fila.find('td:eq(2)').text();
        telefono = fila.find('td:eq(3)').text();
        correo = fila.find('td:eq(4)').text();
        descripcion = fila.find('td:eq(5)').text();
        estado = fila.find('td:eq(6)').text();            
        $("#codigo").val(codigo);
        $("#nombre").val(nombre);
        $("#direccion").val(direccion);
        $("#telefono").val(telefono);
        $("#correo").val(correo);
        $("#descripcion").val(descripcion);
        $("#estado").val(estado);            
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Proveedor");		
        $('#modalCRUD').modal('show');		   
    });

    // BORRAR
    $(document).on("click", ".btnBorrar", function(){
        fila = $(this);           
        codigo = parseInt($(this).closest('tr').find('td:eq(0)').text());            
        Swal.fire({
            title: '¿Confirma eliminar el registro?',                
            showCancelButton: true,
            confirmButtonText: `Confirmar`,                
        }).then((result) => {               
            if (result.isConfirmed) {
                $.ajax({
                    url: url + codigo,
                    method: 'delete',                        
                    data:  {id:codigo},    
                    success: function() {
                        tablaProveedor.row(fila.parents('tr')).remove().draw();                  
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success');
            } 
        });
    });     

    // Submit para el CREAR y EDITAR
    $('#formTallas').submit(function(e){                                     
        e.preventDefault();
        codigo = $.trim($('#codigo').val());    
        nombre = $.trim($('#nombre').val());
        direccion = $.trim($('#direccion').val());    
        telefono = $.trim($('#telefono').val());    
        correo = $.trim($('#correo').val());    
        descripcion = $.trim($('#descripcion').val());    
        estado = $.trim($('#estado').val());                
        if(opcion=='crear'){                
            $.ajax({                    
                url: url,
                method: 'post',                                                         
                contentType: 'application/json',  
                data:  JSON.stringify({nombre: nombre, direccion: direccion, telefono: telefono, correo: correo, descripcion: descripcion, estado: estado}),                       
                success: function(data) {                       
                    tablaProveedor.ajax.reload(null, false);                        
                }
            });	
        }
        if(opcion=='editar'){
            console.log("EDITAR");
            $.ajax({                    
                url: url + codigo,
                method: 'put',                                        
                contentType: 'application/json',  
                data: JSON.stringify({ codigo: codigo, Nombre: nombre, Dirreccion: direccion, Telefono: telefono, Correo: correo, Descripcion: descripcion, Estado: estado }),
                 
                success: function(data) {                       
                    tablaProveedor.ajax.reload(null, false);                        
                }
            });	
        }        		        
        $('#modalCRUD').modal('hide');											     			
    });
});