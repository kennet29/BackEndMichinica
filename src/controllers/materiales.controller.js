import Material from "../models/Materiales.js";
export const getMateriales = async (req, res) => {
  try {
    res.render('materiales.ejs', {
      cssPaths: ['/css/estilo-footer.css','/css/extras.css' ]
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllMateriales = async (req, res) => {
  try {
    const materiales = await Material.find();
    res.status(200).json(materiales);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createNewMaterial = async (req, res) => {
  const material = req.body;
  const newMaterial = new Material(material);
  try {
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteMaterialById = async (req, res) => {
  const { id } = req.params;


  await Material.findByIdAndRemove(id);
  res.json({ message: "Material deleted successfully." });
};

export const updateMaterialById = async (req, res) => {
  const { id } = req.params;
  const { material, descripcion, estado } = req.body;

 

  const updatedMaterial = { material, descripcion, estado, _id: id };

  await Material.findByIdAndUpdate(id, updatedMaterial, { new: true });

  res.json(updatedMaterial);
};