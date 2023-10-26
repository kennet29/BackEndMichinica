$(document).ready(function() {
    let url = 'http://localhost:3000/promociones'; // Actualiza la URL para que coincida con las rutas de tu controlador
    let opcion = null;
    let codigo, nombre, fechaInicio, fechaFinal, descuento, descripcion, estado, cantidad, fila;

    //MOSTRAR
    let tablaPromociones = $('#TablaProm').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            { "data": "codigo" },
            { "data": "nombre" },
            { "data": "fechaInicio" },
            { "data": "fechaFinal" },
            { "data": "descuento" },
            { "data": "descripcion" },
            { "data": "estado" },
            { "data": "cantidad" },
            {
                "defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-info btn-sm btnEditar'>Editar</button><button class='btn btn-danger btn-sm btnBorrar'>Borrar</button></div></div>"
            }
        ],
        "columnDefs": [
            {
                "targets": [2, 3],
                "render": function(data, type, row) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                "targets": 4,
                "render": function(data, type, row) {
                    return data + '%';
                }
            }
        ]
    });

    //CREAR
    $("#btnCrear").click(function() {
        opcion = 'crear';
        codigo = null;
        $("#formPromociones").trigger("reset");
        $(".modal-header").css("background-color", "#23272b");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Crear Promoción");
        $('#modalCRUD').modal('show');
    });

    //EDITAR
    $(document).on("click", ".btnEditar", function() {
        opcion = 'editar';
        fila = $(this).closest("tr");
        codigo = parseInt(fila.find('td:eq(0)').text());
        nombre = fila.find('td:eq(1)').text();
        fechaInicio = moment(fila.find('td:eq(2)').text());
        fechaFinal = moment(fila.find('td:eq(3)').text());
        descuento = parseInt(fila.find('td:eq(4)').text());
        descripcion = fila.find('td:eq(5)').text();
        estado = fila.find('td:eq(6)').text();
        cantidad = parseInt(fila.find('td:eq(7)').text());
        $("#codigo").val(codigo);
        $("#nombre").val(nombre);
        $("#fechaInicio").val(fechaInicio.format('YYYY-MM-DD'));
        $("#fechaFinal").val(fechaFinal.format('YYYY-MM-DD'));
        $("#descuento").val(descuento);
        $("#descripcion").val(descripcion);
        $("#estado").val(estado);
        $("#cantidad").val(cantidad);
        $(".modal-header").css("background-color", "#4a4a4a");
        $(".modal-header").css("color", "white");
        $(".modal-title").text("Editar Promoción");
        $('#modalCRUD').modal('show');
    });

    //BORRAR
    $(document).on("click", ".btnBorrar", function() {
        fila = $(this);
        codigo = parseInt($(this).closest('tr').find('td:eq(0)').text());
        Swal.fire({
            title: '¿Confirma eliminar esta promoción?',
            showCancelButton: true,
            confirmButtonText: `Confirmar`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: url + '/' + codigo,
                    method: 'DELETE',
                    success: function() {
                        tablaPromociones.row(fila.parents('tr')).remove().draw();
                    }
                });
                Swal.fire('¡Registro Eliminado!', '', 'success')
            }
        })
    });

    //submit para CREAR y EDITAR
    $('#formPromociones').submit(function(e) {
        e.preventDefault();
        codigo = $.trim($('#codigo').val());
        nombre = $.trim($('#nombre').val());
        fechaInicio = $.trim($('#fechaInicio').val());
        fechaFinal = $.trim($('#fechaFinal').val());
        descuento = parseInt($.trim($('#descuento').val()));
        descripcion = $.trim($('#descripcion').val());
        estado = parseInt($.trim($('#estado').val()));
        cantidad = parseInt($.trim($('#cantidad').val()));
        if (opcion == 'crear') {
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    nombre: nombre,
                    fechaInicio: fechaInicio,
                    fechaFinal: fechaFinal,
                    descuento: descuento,
                    descripcion: descripcion,
                    estado: estado,
                    cantidad: cantidad,
                }),
                success: function(data) {
                    tablaPromociones.ajax.reload(null, false);
                }
            });
        }
        if (opcion == 'editar') {
            $.ajax({
                url: url + '/' + codigo,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    codigo: codigo,
                    nombre: nombre,
                    fechaInicio: fechaInicio,
                    fechaFinal: fechaFinal,
                    descuento: descuento,
                    descripcion: descripcion,
                    estado: estado,
                    cantidad: cantidad,
                }),
                success: function(data) {
                    tablaPromociones.ajax.reload(null, false);
                }
            });
        }
        $('#modalCRUD').modal('hide');
    });
});
