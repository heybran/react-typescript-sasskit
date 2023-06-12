import { ShoppingBag } from "./Icon";
import { useProductsContext } from "../context/ProductsContext";

export default function ShoppingCart() {
  const products = useProductsContext();
  const productsInShoppingBag = [...products].filter((product) => {
    return product.isInShoppingBag;
  });

  return (
    <button className="shopping-bag header-nav__button">
      <ShoppingBag />
      <span className="shopping-bag__counter">
        {productsInShoppingBag.length}
      </span>
    </button>
  );
}
