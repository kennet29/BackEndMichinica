$(document).ready(function() {   
    let url = 'http://localhost:3000/tallas/';
    let opcion = null;
    let codigo, nombre, descripcion, estado, fila;
    //MOSTRAR
    let tablaTallas = $('#TablaTall').DataTable({            
        "ajax":{
            "url": url,
            "dataSrc":""
        },
        "columns":[
            {"data":"codigo"},
            {"data":"talla"},
            {"data":"descripcion"},
            {"data":"estado"},
            {"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"}
        ],
        "columnDefs":[{
            "targets":[3],
            render(v){
                return Number(v).toFixed(3)
            }
        }]              
    });
    //CREAR
    $("#btnCrear").click(function(){
        opcion='crear';            
        id=null;
        $("#formTallas").trigger("reset");
        $(".modal-header").css( "background-color", "#23272b");
        $(".modal-header").css( "color", "white" );
        $(".modal-title").text("Crear Artículo");
        $('#modalCRUD').modal('show');	    
    });    
    //EDITAR        
    $(document).on("click", ".btnEditar", function(){		            
        opcion='editar';
        fila = $(this).closest("tr");	        
        codigo = parseInt(fila.find('td:eq(0)').text());
        nombre= fila.find('td:eq(1)').text();
        descripcion = fila.find('td:eq(2)').text();
        estado = fila.find('td:eq(3)').text();            
        $("#codigo").val(codigo);
        $("#nombre").val(nombre);
        $("#descripcion").val(descripcion);
        $("#estado").val(estado);            
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white" );
        $(".modal-title").text("Editar Artículo");		
        $('#modalCRUD').modal('show');		   
    });

     //BORRAR
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
                    url: url+codigo,
                    method: 'DELETE',                        
                    data:  {id:codigo},    
                    success: function() {
                        tablaTallas.row(fila.parents('tr')).remove().draw();                  
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success')
            } 
            })
    });     
    //submit para el CREAR y EDITAR
    $('#formTallas').submit(function(e){                                     
        e.preventDefault();
        codigo = $.trim($('#codigo').val());    
        nombre = $.trim($('#nombre').val());
        descripcion = $.trim($('#descripcion').val());    
        estado = $.trim($('#estado').val());                
        if(opcion=='crear'){                
            $.ajax({                    
                url: url,
                method: 'post',                                                         
                contentType: 'application/json',  
                data:  JSON.stringify({nombre: nombre, descripcion:descripcion, estado:estado}),                       
                success: function(data) {                       
                    tablaTallas.ajax.reload(null, false);                        
                }
            });	
        }
        if(opcion=='editar'){
            console.log("EDITAR");
            $.ajax({                    
                url: url+codigo,
                method: 'PUT',                                        
                contentType: 'application/json',  
                data:  JSON.stringify({codigo:codigo, descripcion:descripcion, nombre:nombre, estado:estado}),                       
                success: function(data) {                       
                    tablaTallas.ajax.reload(null, false);                        
                }
            });	
        }        		        
        $('#modalCRUD').modal('hide');											     			
    });
});