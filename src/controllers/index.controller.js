import { getConnection, querys, sql } from "../database";

export const getIndex = async (req, res) => {
  try {
    res.render('index', {
      cssPaths: ['/css/estilos.css', '/css/estilo-footer.css']
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
