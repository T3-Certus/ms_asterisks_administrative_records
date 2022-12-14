import { IndividualProductModel } from "../model/individual_products.model";
import {
  GenericServiceErrorResponse,
  GenericServiceResponse,
} from "../utils/interfaces/responses";
import {
  status200Ok,
  status201Created,
  status400BadRequest,
  status404NotFound,
  status500InternalServerError,
} from "../utils/methods/httpResponses";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { getGenericResponseHelper } from "../utils/methods/responseHelpers";
import { ProductColorModel, ProductSizeModel } from "../model";

const individualProductModel = IndividualProductModel;
const resourceName = "individual_products";

export async function getIndividualProducts(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const { idGlobal, idIndividual } = req.params;

  try {
    const individualProducts = await individualProductModel.findAll({
      attributes: [
        "id_individual_product",
        "id_global_product",
        // "id_product_size",
        // "id_product_color",
        "product_stock",
        "product_price",
        "product_sku",
        "product_url_img",
        "has_offer",
        "percent_discount",
      ],
      where:
        idGlobal && idIndividual
          ? { id_global_product: idGlobal, id_individual_product: idIndividual }
          : idGlobal && !idIndividual
          ? { id_global_product: idGlobal }
          : {},
      include: [
        {
          model: ProductSizeModel,
          attributes: [
            ["id_product_size", "id"],
            ["product_size_name", "name"],
          ],
        },
        {
          model: ProductColorModel,
          attributes: [
            ["id_product_color", "id"],
            ["product_color_name", "name"],
          ],
        },
      ],
    });

    getGenericResponseHelper(individualProducts, resourceName, res);
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`));
  }
}

export async function postIndividualProduct(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const {
    id_global_product,
    id_product_size,
    id_product_color,
    product_stock,
    product_price,
    // product_sku,
    product_url_img,
    has_offer,
    percent_discount,
  } = req.body;
  const product_sku = nanoid()

  try {
    const newIndividualProduct = await individualProductModel.create({
      id_global_product,
      id_product_size,
      id_product_color,
      product_stock,
      product_price,
      product_sku,
      product_url_img,
      has_offer,
      percent_discount,
    });
    return res
      .status(201)
      .json(status201Created(newIndividualProduct, "individual_product"));
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`));
  }
}

export async function putIndividualProduct(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const {
    id_global_product,
    id_product_size,
    id_product_color,
    product_stock,
    product_price,
    // product_sku,
    product_url_img,
    has_offer,
    percent_discount,
  } = req.body;

  const { id } = req.params;

  try {
    const editedIndividualProduct = await IndividualProductModel.update(
      {
        id_global_product,
        id_product_size,
        id_product_color,
        product_stock,
        product_price,
        // product_sku,
        product_url_img,
        has_offer,
        percent_discount,
      },
      { where: { id_individual_product: id } }
    );
    return res
      .status(200)
      .json(
        status200Ok(editedIndividualProduct, "individual_product", "", true)
      );
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`));
  }
}

export async function deleteIndividualProduct(
  req: any,
  res: Response<GenericServiceResponse | GenericServiceErrorResponse>
) {
  const {individualProductId} = req.params

  try {
    const deleteProduct = await individualProductModel.destroy({where: {id_individual_product: individualProductId}})

    return res.status(200).json(status200Ok(deleteProduct, "individual_products", "", false, true))
  } catch (error) {
    return res.status(500).json(status500InternalServerError(`${error}`))
  }

}