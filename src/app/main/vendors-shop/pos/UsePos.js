import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

export default function useEcomerce() {
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cartItemsOnCookie] = useState(null);
  const [cookies, setCookie] = useCookies(['cart']);
  const [singleCartItem, setSingleCartItem] = useState(null);
  //   const [products, setProducts] = useState(null);
  // const { cartItems } = useSelector((state) => state.ecomerce);
  // const { shippingAddress } = useSelector((state) => state.ecomerce);
  // const { placedOrder } = useSelector((state) => state.ecomerce);
  const cartItems = cookies?.cart;

  return {
    loading,
    cartItems,
    singleCartItem,
    // products,
    // getProducts: async (payload, group = '') => {
    //     setLoading(true);
    //     if (payload && payload.length > 0) {
    //         if (cartItems && cartItems.length > 0) {
    //             if (group === 'cart') {
    //                 let cartMainItems = cartItems;
    //                 payload.forEach((item) => {
    //                     let existItem = cartMainItems.find(
    //                         (val) => val._id === item.id
    //                     );
    //                     if (existItem) {
    //                         existItem.quantity = item.quantity;
    //                     }
    //                 });

    //                 setProducts(cartMainItems);
    //             } else {
    //                 setProducts(null);
    //             }
    //             setTimeout(
    //                 function () {
    //                     setLoading(false);
    //                 }.bind(this),
    //                 250
    //             );
    //         }
    //     } else {
    //         setLoading(false);
    //         setProducts([]);
    //     }
    // },

    getCartItem: (payload, currentCart) => {
      //   let cartItem = {};
      if (currentCart) {
        currentCart = currentCart;
        const existItem = currentCart?.find((item) => item?.id === payload);
        if (existItem) {
          // existItem.quantity = existItem.quantity + 1;
          //   return cartItem;
          setSingleCartItem(existItem);
        }
      }
      //   return null;
    },

    increaseQty: (payload, currentCart) => {
      let cart = [];
      if (currentCart) {
        cart = currentCart;
        const existItem = cart?.find((item) => item.id === payload.id);
        if (existItem) {
          existItem.quantity = existItem.quantity + 1;
        }
        setCookie('cart', cart, { path: '/' });
        // dispatch(setCartItemsSuccess(cart));
      }
      return cart;
    },

    decreaseQty: (payload, currentCart) => {
      console.log('Decreasing qty', payload, currentCart);
      let cart = [];
      if (currentCart) {
        cart = currentCart;
        const existItem = cart?.find((item) => item?.id === payload?.id);
        if (existItem) {
          if (existItem?.quantity > 1) {
            existItem.quantity = existItem?.quantity - 1;
          }
        }
        setCookie('cart', cart, { path: '/' });
        // dispatch(setCartItemsSuccess(cart));
      }
      return cart;
    },

    addItem: (newItem, items, group) => {
      //   console.log('cart-Items', items, newItem, group);
      let newItems = [];
      if (items) {
        newItems = items;
        const existItem = items?.find((item) => item?.id === newItem?.id);
        if (existItem) {
          if (group === 'cart') {
            existItem.quantity += newItem?.quantity;
          }
        } else {
          newItems.push(newItem);
        }
      } else {
        newItems.push(newItem);
      }
      if (group === 'cart') {
        setCookie('cart', newItems, { path: '/' });
        // dispatch(setCartItemsSuccess(newItems));
      }
      // if (group === 'wishlist') {
      //     setCookie('wishlist', newItems, { path: '/' });

      //     dispatch(setWishlistTtemsSuccess(newItems));
      // }

      // if (group === 'compare') {
      //     setCookie('compare', newItems, { path: '/' });
      //     dispatch(setCompareItemsSuccess(newItems));
      // }
      return newItems;
    },

    removeItem: (selectedItem, items, group) => {
      let currentItems = items;
      if (currentItems?.length > 0) {
        const index = currentItems?.findIndex(
          (item) => item?.id === selectedItem?.id
        );
        currentItems?.splice(index, 1);
      }
      if (group === 'cart') {
        setCookie('cart', currentItems, { path: '/' });

        // dispatch(setCartItemsSuccess(currentItems));
      }

      // if (group === 'wishlist') {
      //     setCookie('wishlist', currentItems, { path: '/' });
      //     dispatch(setWishlistTtemsSuccess(currentItems));
      // }

      // if (group === 'compare') {
      //     setCookie('compare', currentItems, { path: '/' });
      // }
    },

    removeItems: (group) => {
      // if (group === 'wishlist') {
      //     setCookie('wishlist', [], { path: '/' });
      //     dispatch(setWishlistTtemsSuccess([]));
      // }
      // if (group === 'compare') {
      //     setCookie('compare', [], { path: '/' });
      //     dispatch(setCompareItemsSuccess([]));
      // }
      if (group === 'cart') {
        setCookie('cart', [], { path: '/' });
        // dispatch(setCartItemsSuccess([]));
      }
    },

    // placeOrder: (newOrder, orders) => {
    //   let newOrders = [];
    //   if (orders) {
    //     newOrders = orders;

    //     const existItem = orders.find((item) => item.id === newOrder.id);
    //     if (existItem) {
    //       alert('Order already exists');
    //     } else {
    //       newOrders.push(newOrder);
    //     }
    //   } else {
    //     newOrders.push(newOrder);
    //   }

    //   setCookie('place_order', newOrders, { path: '/' });
    //   // dispatch(setOrderPlacementSuccess(newOrders));

    //   return newOrders;
    // },

    // addOrderItem: (newItem, items) => {
    //   let newItems = [];
    //   if (items) {
    //     newItems = items;
    //     const existItem = items.find((item) => item.id === newItem.id);
    //     if (existItem) {
    //       alert('order already Exists');
    //       return;
    //     } else {
    //       newItems.push(newItem);
    //       setCookie('place_order', newOrders, { path: '/' });
    //       dispatch(setOrderPlacementSuccess(newOrders));

    //       setCookie('cart', [], { path: '/' });
    //       dispatch(setCartItemsSuccess([]));
    //     }
    //   } else {
    //     newItems.push(newItem);
    //     setCookie('place_order', newOrders, { path: '/' });
    //     dispatch(setOrderPlacementSuccess(newOrders));

    //     setCookie('cart', [], { path: '/' });
    //     dispatch(setCartItemsSuccess([]));
    //   }

    //   return newItems;
    // },
  };
}
