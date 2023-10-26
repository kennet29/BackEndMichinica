$(document).ready(function() {
    let url = 'http://localhost:3000/api/categorias/'; // Ruta a tu API
    let opcion = null;
    let  Categoria, Descripcion, Estado, fila;

    let tablaCategorias = $('#Tabla').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            { "data": "categoria" },
            { "data": "descripcion" },
            { "data": "estado" },
            {
                "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"
            }
        ]
    });

    $("#btnCrear").click(function() {
        opcion = 'crear';
        id = null;
        $("#form").trigger("reset");
        $(".modal-header").css("background-color", "#23272b");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Crear Categoría");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnEditar", function() {
        opcion = 'editar';
        fila = $(this).closest("tr");
        id = fila.find('td:eq(0)').text();
        Categoria = fila.find('td:eq(0)').text();
        Descripcion = fila.find('td:eq(1)').text();
        Estado = fila.find('td:eq(2)').text();
      
        $("#Categoria").val(Categoria);
        $("#Descripcion").val(Descripcion);
        $("#Estado").val(Estado);
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Categoría");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnBorrar", function() {
        fila = $(this).closest('tr');
        id = fila.find('td:eq(0)').text();
        Swal.fire({
            title: '¿Confirma eliminar el registro?',
            showCancelButton: true,
            confirmButtonText: `Confirmar`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: url + id,
                    method: 'DELETE',
                    success: function() {
                        tablaCategorias.row(fila).remove().draw();
                    },
                    error: function() {
                        console.error("Error deleting category.");
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success');
            }
        });
    });

    $('#form').submit(function(e) {
        e.preventDefault();
        Categoria = $.trim($('#Categoria').val());
        Descripcion = $.trim($('#Descripcion').val());
        Estado = $.trim($('#Estado').val());

        if (opcion == 'crear') {
            $.post(url, { Categoria, Descripcion, Estado })
            .done(function(data) {
                tablaCategorias.ajax.reload(null, false);
                $('#modalCRUD').modal('hide');
            })
            .fail(function() {
                console.error("Error creating category.");
            });
        }
        
        if (opcion == 'editar') {
            id = $.trim($('#id').val());
            $.ajax({
                url: url + id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ id, Categoria, Descripcion, Estado }),
                success: function(data) {
                    tablaCategorias.ajax.reload(null, false);
                    $('#modalCRUD').modal('hide');
                },
                error: function() {
                    console.error("Error updating category.");
                }
            });
        }
    });
});
