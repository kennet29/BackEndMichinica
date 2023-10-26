$(document).ready(function () {
    let url = 'http://localhost:3000/estilos/';
    let opcion = null;
    let codigo, nombre, descripcion, estado, fila;

    let tablaArticulos = $('#Tabla').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [{
                "data": "codigo"
            },
            {
                "data": "nombre"
            },
            {
                "data": "descripcion"
            },
            {
                "data": "estado"
            },
            {
                "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"
            }
        ]
    });

    $("#btnCrear").click(function () {
        opcion = 'crear';
        id = null;
        $("#form").trigger("reset");
        $(".modal-header").css("background-color", "#23272b");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Crear Artículo");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnEditar", function () {
        opcion = 'editar';
        fila = $(this).closest("tr");
        codigo = parseInt(fila.find('td:eq(0)').text());
        nombre = fila.find('td:eq(1)').text();
        descripcion = fila.find('td:eq(2)').text();
        estado = fila.find('td:eq(3)').text();
        $("#id").val(codigo);
        $("#nombre").val(nombre);
        $("#descripcion").val(descripcion);
        $("#estado").val(estado);
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Artículo");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnBorrar", function () {
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
                    method: 'DELETE',
                    success: function () {
                        tablaArticulos.row(fila.parents('tr')).remove()
                            .draw();
                    },
                    error: function () {
                        console.error("Error deleting color.");
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success');
            }
        });
    });

    $('#form').submit(function (e) {
        e.preventDefault();
        nombre = $.trim($('#nombre').val());
        descripcion = $.trim($('#descripcion').val());
        estado = $.trim($('#estado').val());

        if (opcion == 'crear') {
            $.post(url, {
                    nombre,
                    descripcion,
                    estado
                })
                .done(function (data) {
                    tablaArticulos.ajax.reload(null, false);
                    $('#modalCRUD').modal('hide');
                })
                .fail(function () {
                    console.error("Error creating color.");
                });
        }

        if (opcion == 'editar') {
            codigo = $.trim($('#id').val());
            $.ajax({
                url: url + codigo,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    codigo,
                    nombre,
                    descripcion,
                    estado
                }),
                success: function (data) {
                    tablaArticulos.ajax.reload(null, false);
                    $('#modalCRUD').modal('hide');
                },
                error: function () {
                    console.error("Error updating color.");
                }
            });
        }
    });
});