import { getConnection, querys, sql } from "../database";

export const getProducts = async (req, res) => {
  try {
    //const pool = await getConnection();
    //const result = await pool.request().query(querys.getAllProducts);
    //var data = JSON.stringify(Object.assign([], result.recordset));
    //var data = (result.recordset);
    res.render('productos.ejs');
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};
export const getProductos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.getAllProducts);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const createNewProduct = async (req, res) => {
  const { nombre, descripcion } = req.body;
  let { estado } = req.body;

  // validating
  if (descripcion == null || nombre == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  if (estado == null) estado = 0;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.VarChar, descripcion)
      .input("estado", sql.Bit, estado)
      .query(querys.addNewProduct);

    res.json({ nombre, descripcion, estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query(querys.getProducById);
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query(querys.deleteProduct);

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getTotalProducts = async (req, res) => {
  const pool = await getConnection();

  const result = await pool.request().query(querys.getTotalProducts);
  console.log(result);
  res.json(result.recordset[0][""]);
};

export const updateProductById = async (req, res) => {
  const { descripcion, nombre, estado } = req.body;

  // validating
  if (descripcion == null || nombre == null || estado == null) {
    return res.status(400).json({ msg: "Baddd Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.VarChar, descripcion)
      .input("estado", sql.Bit, estado)
      .input("codigo", req.params.id)
      .query(querys.updateProductById);
    res.json({ nombre, descripcion, estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
