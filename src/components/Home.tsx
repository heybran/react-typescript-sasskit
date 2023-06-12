import { useState } from "react";
import Header from "./Header";
import { ProductsContext } from "../context/ProductsContext";
import furnitures from "../data/furnitures";
import { Product } from "../routes/Root";

export default function Home() {
  const [products] = useState<Product[]>(furnitures);

  return (
    <div className="content-wrapper">
      <ProductsContext.Provider value={products}>
        <Header />
        {/* <ProductGrid /> */}
      </ProductsContext.Provider>
    </div>
  );
}
