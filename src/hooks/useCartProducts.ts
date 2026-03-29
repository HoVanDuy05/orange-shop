import { useUserStore, CartItem } from '../store/userStore';
import { useAppQuery } from './useAppQuery';

interface Product {
  id: number;
  product_name: string;
  price: number;
  image_url?: string;
  category_name?: string;
}

type CartItemWithDetails = CartItem & Partial<Product>;

export const useCartProducts = () => {
  const { cart } = useUserStore();

  // Fetch all products một lần, cache lâu dài
  const { data: productsData, isLoading } = useAppQuery(
    'all-products-cart',
    '/products'
  );

  const products = Array.isArray(productsData) ? productsData : (productsData?.products || []);

  // Merge cart with product details
  const cartWithDetails: CartItemWithDetails[] = cart.map(cartItem => {
    const product = products.find((p: Product) => p.id === cartItem.id);
    return {
      ...cartItem,
      ...product
    };
  });

  return {
    cartWithDetails,
    isLoading,
    isEmpty: cart.length === 0
  };
};
