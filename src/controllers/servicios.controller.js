import Servicio from '../models/Servicios.js';

export const crearServicio = async (req, res) => {
  try {
    const nuevoServicio = new Servicio(req.body);
    const servicioGuardado = await nuevoServicio.save();
    res.status(201).json(servicioGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerServicioPorId = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarServicio = async (req, res) => {
  try {
    const servicioActualizado = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(servicioActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    await Servicio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
