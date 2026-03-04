import { Router } from "express";
import { productsModel } from "../models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Lógica de filtrado por categoría o disponibilidad 
    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: query },
          { status: query === "true" }
        ]
      };
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true // Necesario para que Handlebars lea los objetos correctamente 
    };

    const result = await productsModel.paginate(filter, options);

    res.send({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Error al obtener productos" });
  }
});

export default router;