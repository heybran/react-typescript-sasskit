import { ShoppingBag } from "./Icon"
import { useProductsContext } from "../context/ProductsContext"

export default function ShoppingCart() {
  const products = useProductsContext();
  const productsInShoppingBag = [...products].filter((product) => {
    return product.isInShoppingBag;
  });

  return (
    <button className="shopping-bag">
      <ShoppingBag />
      <span>{productsInShoppingBag.length}</span>
    </button>
  )
}