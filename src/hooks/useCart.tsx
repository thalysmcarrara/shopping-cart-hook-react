import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product_cart_index = cart.findIndex((item) => item.id === productId)
      const stock: Stock = await api.get(`/stock/${productId}`).then((response) => response.data)

      if(product_cart_index > -1) {
        if(stock.amount > cart[product_cart_index].amount){
          cart[product_cart_index].amount += 1
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          toast.error('Quantidade solicitada fora de stock')
        }
      } else {
        if(stock.amount > 0) {
          const product = await api.get(`/products/${productId}`).then((response) => response.data)
          product.amount = 1

          cart.push(product)
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          toast.error('Quantidade solicitada fora de stock')
        }
      }

    } catch {
      toast.error('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const product_cart_index = cart.findIndex((item) => item.id === productId)

      if(product_cart_index > -1){
        const new_cart = cart.filter((item) => item.id !== productId)

        setCart([...new_cart])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
      } else {
        toast.error('Erro na remoção do produto')
      }

    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const product_cart_index = cart.findIndex((item) => item.id === productId)

      if(product_cart_index > -1){
        const stock: Stock = await api.get(`/stock/${productId}`).then((response) => response.data)

        if(stock.amount >= amount) {
          cart[product_cart_index].amount = amount

          setCart([...cart]);
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          toast.error('Quantidade solicitada fora de stock')
        }
      }

    } catch {
      toast.error('Erro ao atualizar quantidade')
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
