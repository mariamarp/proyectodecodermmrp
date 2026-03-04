import { Router } from "express";
import { cartsModel } from "../models/carts.model.js";

const router = Router();

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    res.send({ status: "success", message: "Producto eliminado", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await cartsModel.findByIdAndUpdate(req.params.cid, { products: req.body }, { new: true });
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartsModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await cartsModel.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
    res.send({ status: "success", message: "Carrito vaciado", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;