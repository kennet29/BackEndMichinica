import mongoose from 'mongoose';

const detallesVentaSchema = new mongoose.Schema(
  {
    id_ventas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ventas',
      required: true,
    },
    articulos: [
      {
        id_articulo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Articulo',
          required: true,
        },
        id_categoria:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Categoria',
          required:true,
        },
        id_marca: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Marca',
          required: true,
        },
        id_color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Color',
          required: true,
        },
        id_estilo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Estilo',
          required: true,
        },
        id_material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material',
          required: true,
        },
        id_talla: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Talla',
          required: true,
        },
        id_diseño: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Diseño',
          required: true,
        },
        id_promocion:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Promocion',
        },
        cantidad: {
          type: Number,
          required: true,
        },
        precio: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
        descuento: {
          type: Number,
          required: true,
        },
        
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const DetallesVenta = mongoose.model('DetallesVenta', detallesVentaSchema);

export default DetallesVenta;
