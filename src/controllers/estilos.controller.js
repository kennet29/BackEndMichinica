
import Estilo from '../models/Estilos.js'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas.

// Obtener todos los estilos
export const getAllEstilos = async (req, res) => {
  try {
    const estilos = await Estilo.find(); // Encuentra todos los estilos en la base de datos
    res.status(200).json(estilos); // Devuelve los estilos en formato JSON si se encuentran
  } catch (error) {
    res.status(500).json({ message: error.message }); // Si hay un error, devuelve un mensaje de error con el estado 500
  }
};

// Crear un nuevo estilo
export const createNewEstilo = async (req, res) => {
  const estilo = new Estilo(req.body); // Crear una nueva instancia de Estilo utilizando los datos del cuerpo de la solicitud
  try {
    const newEstilo = await estilo.save(); // Guardar el nuevo estilo en la base de datos
    res.status(201).json(newEstilo); // Devolver el nuevo estilo creado en formato JSON con el estado 201
  } catch (error) {
    res.status(400).json({ message: error.message }); // Si hay un error, devuelve un mensaje de error con el estado 400
  }
};

// Obtener un estilo por su ID
export const getEstiloById = async (req, res) => {
  const id = req.params.id; // Obtener el ID de los parámetros de la solicitud
  try {
    const estilo = await Estilo.findById(id); // Buscar un estilo por su ID en la base de datos
    res.status(200).json(estilo); // Devolver el estilo encontrado en formato JSON si se encuentra
  } catch (error) {
    res.status(404).json({ message: 'Estilo not found' }); // Si no se encuentra el estilo, devolver un mensaje de error con el estado 404
  }
};

// Eliminar un estilo por su ID
export const deleteEstiloById = async (req, res) => {
  const id = req.params.id; // Obtener el ID de los parámetros de la solicitud
  try {
    await Estilo.findByIdAndRemove(id); // Buscar un estilo por su ID y eliminarlo de la base de datos
    res.status(200).json({ message: 'Estilo deleted successfully' }); // Devolver un mensaje de éxito si se elimina correctamente
  } catch (error) {
    res.status(404).json({ message: 'Estilo not found' }); // Si no se encuentra el estilo, devolver un mensaje de error con el estado 404
  }
};

// Obtener el número total de estilos
export const getTotalEstilos = async (req, res) => {
  try {
    const totalEstilos = await Estilo.countDocuments(); // Contar el número total de estilos en la base de datos
    res.status(200).json({ totalEstilos }); // Devolver el número total de estilos en formato JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // Si hay un error, devuelve un mensaje de error con el estado 500
  }
};

// Actualizar un estilo por su ID
export const updateEstiloById = async (req, res) => {
  const id = req.params.id; // Obtener el ID de los parámetros de la solicitud
  try {
    const estilo = await Estilo.findByIdAndUpdate(id, req.body, { new: true }); // Buscar un estilo por su ID y actualizarlo con los datos del cuerpo de la solicitud
    res.status(200).json(estilo); // Devolver el estilo actualizado en formato JSON
  } catch (error) {
    res.status(404).json({ message: 'Estilo not found' }); // Si no se encuentra el estilo, devolver un mensaje de error con el estado 404
  }
};