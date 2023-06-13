import { useState } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import { ProductsContext } from "../context/ProductsContext";
import furnitures from "../data/furnitures";
import useUser from "../hooks/useUser";

export interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string[];
  isInShoppingBag: boolean;
}

export default function App() {
  const [products] = useState<Product[]>(furnitures);
  const { isPending, user } = useUser();

  return (
    <>
      {!isPending && (
        <div className="content-wrapper">
          <ProductsContext.Provider value={products}>
            <Header />
            <HeroSection />
          </ProductsContext.Provider>
        </div>
      )}
    </>
  );
}
