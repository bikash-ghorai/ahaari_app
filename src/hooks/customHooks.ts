import { setCartToState } from '../redux/app/appSlice';
import { useDispatch, useSelector } from '../redux/store';
import {
  deleteUserCartDataFromAsyncStore,
  getUserCartDataFromAsyncStore,
  setUserCartDataToAsyncStore,
} from '../utils/storage';

interface IAddProduct {
  shop_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
}

const useCart = () => {
  const dispatch = useDispatch();

  const { cartStateValue: cartValue } = useSelector(state => state.app);

  const getCart = async () => {
    try {
      const cart_val = await getUserCartDataFromAsyncStore();
      dispatch(setCartToState(cart_val));
      return {
        data: cart_val,
        message: 'Cart data retrieved successfully',
        status: true,
      };
    } catch (error) {
      console.log('Error in getCart:', error);
      return {
        data: null,
        message: 'An error occurred while retrieving the cart data',
        status: false,
      };
    }
  };

  const addProduct = async (props: IAddProduct) => {
    try {
      let cart = cartValue;
      if (
        !props.shop_id ||
        !props.product_id ||
        !props.variant_id ||
        !props.quantity
      ) {
        return {
          data: cart,
          message: 'Invalid product data',
          status: false,
        };
      }

      if (!cart) {
        cart = {
          shop_id: props.shop_id,
          products: [
            {
              product_id: props.product_id,
              variant_id: props.variant_id,
              quantity: props.quantity,
            },
          ],
        };
      } else {
        if (cart.shop_id !== props.shop_id) {
          return {
            data: cart,
            message:
              'You can only add products from one restaurant at a time. Please empty your cart to add products from another restaurant.',
            status: false,
          };
        } else {
          const updatedCart = cart.products.map((product: any) => {
            if (product.product_id === props.product_id) {
              if (product.variant_id === props.variant_id) {
                return {
                  ...product,
                  quantity: product.quantity + props.quantity,
                };
              }
            }
            return product;
          });
          const isProductPresent = cart.products.some(
            (product: any) =>
              product.product_id === props.product_id &&
              product.variant_id === props.variant_id,
          );
          if (!isProductPresent) {
            updatedCart.push({
              product_id: props.product_id,
              variant_id: props.variant_id,
              quantity: props.quantity,
            });
          }
          cart = {
            ...cart,
            products: updatedCart,
          };
        }
      }
      dispatch(setCartToState(cart));
      await setUserCartDataToAsyncStore(cart);
      return {
        data: cart,
        message: 'Product added to cart successfully',
        status: true,
      };
    } catch (error) {
      console.log('Error in addProduct:', error);
      return {
        data: cartValue,
        message: 'An error occurred while adding the product to the cart',
        status: false,
      };
    }
  };

  const removeProduct = async (props: IAddProduct) => {
    try {
      let cart = cartValue;
      if (
        !props.shop_id ||
        !props.product_id ||
        !props.variant_id ||
        !props.quantity
      ) {
        return {
          data: cart,
          message: 'Invalid product data',
          status: false,
        };
      }
      if (!cart) {
        return {
          data: null,
          message: 'Cart is empty',
          status: false,
        };
      } else {
        const updatedCart = cart.products
          .map((product: any) => {
            if (product.product_id === props.product_id) {
              if (product.variant_id === props.variant_id) {
                const newQuantity = product.quantity - props.quantity;
                if (newQuantity > 0) {
                  return {
                    ...product,
                    quantity: newQuantity,
                  };
                }
                return null; // Mark for removal
              }
            }
            return product;
          })
          .filter((product: any) => product !== null);
        cart = {
          ...cart,
          products: updatedCart,
        };
      }
      dispatch(setCartToState(cart));
      await setUserCartDataToAsyncStore(cart);
      return {
        data: cart,
        message: 'Product removed from cart successfully',
        status: true,
      };
    } catch (error) {
      console.log('Error in removeProduct:', error);
      return {
        data: cartValue,
        message: 'An error occurred while removing the product from the cart',
        status: false,
      };
    }
  };

  const emptyCart = async () => {
    try {
      deleteUserCartDataFromAsyncStore();
      dispatch(setCartToState(null));
      return {
        data: null,
        message: 'Cart emptied successfully',
        status: true,
      };
    } catch (error) {
      console.log('Error in emptyCart:', error);
      return {
        data: cartValue,
        message: 'An error occurred while emptying the cart',
        status: false,
      };
    }
  };

  const getCartQtyCount = (props: {
    product_id?: string;
    variant_id?: string;
  }) => {
    try {
      console.log('cartValue', cartValue);
      if (!cartValue) {
        return 0;
      }

      if (props?.variant_id) {
        const filtered_products = cartValue.products.filter(
          (product: any) => product.variant_id === props.variant_id,
        );
        let quantity_count = 0;
        filtered_products.forEach((product: any) => {
          quantity_count += product.quantity;
        });
        console.log('filtered_products', filtered_products);
        console.log('quantity_count', quantity_count);
        return quantity_count;
      }

      if (props?.product_id) {
        const filtered_products = cartValue.products.filter(
          (product: any) => product.product_id === props.product_id,
        );
        let quantity_count = 0;
        filtered_products.forEach((product: any) => {
          quantity_count += product.quantity;
        });
        return quantity_count;
      }
      return cartValue.products.length;
    } catch (error) {
      console.log('Error in getCartQtyCount:', error);
      return 0;
    }
  };

  return {
    cartValue,
    getCart,
    addProduct,
    removeProduct,
    emptyCart,
    getCartQtyCount,
  };
};

export { useCart };
