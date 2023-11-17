$(document).ready(function() {
    // Configuración DataTable
    const dataTable = $('#coloresTable').DataTable({
        ajax: {
            url: '/api/colores', // La ruta de tu API para obtener colores
            dataSrc: ''
        },
        columns: [
            { data: '_id' },
            { data: 'color' },
            { data: 'estado', render: function(data) { return data ? 'Activo' : 'Inactivo'; } },
            { data: 'descripcion' },
            { data: 'createdAt' },
            { data: 'updatedAt' }
        ]
    });
});