import { createContext, useContext } from "react";
import { Product } from "../routes/Root";

export const ProductsContext = createContext<Product[] | undefined>(undefined);

/**
 * @throws
 * @returns {Product[]}
 */
export function useProductsContext() {
  const products = useContext(ProductsContext);

  if (products === undefined) {
    throw new Error("useProductsContext must be used with a ProductsContext");
  }

  return products;
}
