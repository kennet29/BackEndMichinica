$(document).ready(function() {
    let urlArticulos = '/articulos';
    let urlCategorias = '/categorias';

    let opcion = null;
    let codigoArticulo, nombreArticulo, descripcionArticulo, estadoArticulo, categoriaArticulo, fila;

    function cargarArticulos() {
        tablaArticulos = $('#Tabla').DataTable({
            "ajax": {
                "url": urlArticulos,
                "dataSrc": ""
            },
            "columns": [
                { "data": "codigo" },
                { "data": "Nombre" },
                { "data": "Descripcion" },
                { "data": "Estado" },
                { "data": "nombre_categoria" },
                {
                    "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"
                }
            ]
        });
    }

    cargarArticulos();

    function cargarCategorias() {
        $.ajax({
            url: urlCategorias,
            method: 'GET',
            success: function(categorias) {
                const categoriaSelect = $('#categoriaArticulo');
                categoriaSelect.empty();
                categorias.forEach(function(categoria) {
                    categoriaSelect.append($('<option>', {
                        value: categoria.id,
                        text: categoria.nombre,
                        'data-id': categoria.id
                    }));
                });
            },
            error: function() {
                console.error("Error loading categories.");
            }
        });
    }

    cargarCategorias();

    $("#btnCrear").click(function() {
        opcion = 'crear';
        codigoArticulo = null;
        $("#form").trigger("reset");
        $(".modal-header").css("background-color", "#23272b");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Create Article");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnEditar", function() {
        opcion = 'editar';
        fila = $(this).closest("tr");
        codigoArticulo = parseInt(fila.find('td:eq(0)').text());
        nombreArticulo = fila.find('td:eq(1)').text();
        descripcionArticulo = fila.find('td:eq(2)').text();
        estadoArticulo = fila.find('td:eq(3)').text();
        categoriaArticulo = parseInt(fila.find('td:eq(4)').data('codigoArticulo')); // Obtiene el id de la categoría

        $("#codigoArticulo").val(codigoArticulo);
        $("#nombreArticulo").val(nombreArticulo);
        $("#descripcionArticulo").val(descripcionArticulo);
        $("#categoriaArticulo").val(categoriaArticulo);
        $("#estadoArticulo").val(estadoArticulo);
        $(".modal-header").css("background-color", "#7303c0");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Edit Article");
        $('#modalCRUD').modal('show');
    });

    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        codigoArticulo = parseInt($(this).closest('tr').find('td:eq(0)').text());
        Swal.fire({
            title: 'Confirm delete?',
            showCancelButton: true,
            confirmButtonText: `Confirm`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: urlArticulos + "/" + codigoArticulo,
                    method: 'DELETE',
                    success: function() {
                        Tabla.row(fila.parents('tr')).remove().draw();
                    },
                    error: function() {
                        console.error("Error deleting article.");
                    }
                });
                Swal.fire('Record Deleted!', '', 'success');
            }
        });
    });

    $('#form').submit(function(e) {
        e.preventDefault();
        nombreArticulo = $.trim($('#nombreArticulo').val());
        descripcionArticulo = $.trim($('#descripcionArticulo').val());
        estadoArticulo = $.trim($('#estadoArticulo').val());
        categoriaArticulo = $.trim($('#categoriaArticulo').data('id'));

        if (opcion == 'crear') {
            $.post(urlArticulos, {
                nombre: nombreArticulo,
                descripcion: descripcionArticulo,
                estado: estadoArticulo,
                id_categoria: categoriaArticulo
            })
                .done(function(data) {
                    Tabla.ajax.reload(null, false);
                    $('#modalCRUD').modal('hide');
                })
                .fail(function() {
                    console.error("Error creating article.");
                });
        }

        if (opcion == 'editar') {
            $.ajax({
                url: urlArticulos + "/" + codigoArticulo,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    codigo: codigoArticulo,
                    nombre: nombreArticulo,
                    descripcion: descripcionArticulo,
                    estado: estadoArticulo,
                    id_categoria: categoriaArticulo
                }),
                success: function(data) {
                    Tabla.ajax.reload(null, false);
                    $('#modalCRUD').modal('hide');
                },
                error: function() {
                    console.error("Error updating article.");
                }
            });
        }
    });
});

