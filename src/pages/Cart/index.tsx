import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  // const cartFormatted = cart.map(product => ({
  //   // TODO
  // }))

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal += product.amount * product.price
        return sumTotal
      }, 0)
    )

  console.log(total)

  function handleProductIncrement(product: Product) {
    const new_amount = product.amount + 1

    updateProductAmount({ productId: product.id, amount: new_amount })
  }

  function handleProductDecrement(product: Product) {
    const new_amount = product.amount - 1

    updateProductAmount({ productId: product.id, amount: new_amount })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map(({ image, title, price, amount, id }) => (
            <tr data-testid="product" key={id}>
              <td>
                <img src={image} alt={title} />
              </td>
              <td>
                <strong>{title}</strong>
                <span>{formatPrice(price)}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={amount <= 1}
                    onClick={() => handleProductDecrement({ image, title, price, amount, id })}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement({ image, title, price, amount, id })}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{formatPrice(amount * price)}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          )
          )}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
