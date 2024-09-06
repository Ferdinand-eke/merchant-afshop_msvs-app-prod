import { Controller, useForm } from "react-hook-form";
import { calculateTotalCartAmount, formatCurrency } from "../PosUtils";
import { useShopCreateInvoiceOrder } from "app/configs/data/server-calls/orders/useShopOrders";
import useEcomerce from "../UsePos";
import _ from "@lodash";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";



const defaultValues = {
    name: "",
    email: "",
    phone: "",
    taxPrice: 0,
    totalPrice: 0,
};
/**
 * Form Validation Schema
 */
const schema = z.object({
    phone: z.string().nonempty("Phone is required"),
  name: z.string().nonempty("Name is required"),
  //   username: z.string().nonempty("Username is required"),
  //   title: z.string().nonempty("Title is required"),
  //   company: z.string().nonempty("Company is required"),
  //     shopbio: z.string().nonempty("Sho bio is required"),
      email: z.string().email("Invalid email").nonempty("Email is required"),
     

      paymentmethod: z.string().nonempty("Payment method is required"),
  //     businezState: z.string().nonempty("State is required"),
  //     businezLga: z.string().nonempty("L.G.A/County is required"),
  //     market: z.string().nonempty("Market is required"),

  //     tradehub: z.string().nonempty("Trade Hub is required"),
  //     shopplan: z.string().nonempty("A shop plan is required"),
  //   //   language: z.string().nonempty("Language is required"),
});

const DisplayCart = () => {
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      defaultValues,
      mode: "all",
      resolver: zodResolver(schema),
    }
  );
  const { isValid, dirtyFields, errors } = formState;
  const {
    removeItems,
    cartItems,
    decreaseQty,
    increaseQty,
    // getCartItem,
    // singleCartItem,
    removeItem,
  } = useEcomerce();
  const createInvoice = useShopCreateInvoiceOrder();

  const [totalCartAmount, setTotalCartAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vat, setVat] = useState(7.5 / 100);
  const [vatedCart, setVatedCart] = useState(0);

  useEffect(() => {
    if (createInvoice.isSuccess) {
      reset(defaultValues);
      removeItems("cart");
    }

    if (cartItems) {
      setTotalCartAmount(calculateTotalCartAmount(cartItems));
    }
    if (totalCartAmount) {
      setVatedCart(totalCartAmount * vat);
    }
  }, [cartItems, totalCartAmount, discount, createInvoice.isSuccess]);

  const removeItemFromInvoice = (cartItem) => {
    if (cartItems?.length === 1) {
      reset();
      setTotalCartAmount(0);
      setVatedCart(0);
      setDiscount(0);
    }
    removeItem(cartItem, cartItems, "cart");
  };

  const removeAllItemsFromInvoice = () => {
    // if(cartItems?.length === 1){
    reset();
    setTotalCartAmount(0);
    setVatedCart(0);
    setDiscount(0);
    // }
    removeItems("cart");
  };

  /**
   * Form Submit
   */
  function onSubmit(formData) {
    // console.log("INVOICE-DETAILS", formData);
   
    if (formData) {
        const invoiceToSave = {
          ...formData,
          invoiceItems: cartItems,
          itemsPrice: totalCartAmount,
          taxPrice: vatedCart,
          totalPrice: vatedCart + discount + totalCartAmount,
        };

        // if (
        //     !formData.name ||
        //     !formData.email < 1 ||
        //     !formData.phone < 1
        //      ||
        //     !formData.paymentmethod
        // ) {
        //   return toast.info('all fields required');
        // }

        // console.log("INVOICE-DETAILS", formData);
        // console.log("INVOICE-DETAILS22", invoiceToSave);

        // return
        createInvoice.mutate(invoiceToSave);
      }
    // return;
    // createInvoice?.mutate(formData);
  }

  useEffect(() => {
    if (createInvoice.isSuccess) {
      reset();
      setTotalCartAmount(0);
      setVatedCart(0);
      setDiscount(0);
      removeItems("cart");
    }

    if (cartItems) {
      setTotalCartAmount(calculateTotalCartAmount(cartItems));
    }
    if (totalCartAmount) {
      setVatedCart(totalCartAmount * vat);
    }
  }, [cartItems, totalCartAmount, discount, createInvoice.isSuccess]);
  return (
    <>
 
      <div className="w-full">
        <Typography className="text-xl">New Invoice</Typography>
     
      </div>
      <div className="box p-2 mt-5">
        {cartItems && cartItems?.length > 0 ? (
          cartItems?.map((item) => (
            <div
              key={item?.id}
              className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md"
            >
              <div className="max-w-[50%] truncate mr-1">
                <FuseSvgIcon
                  onClick={() => {
                    removeItemFromInvoice(item);
                  }}
                >
                  heroicons-outline:trash
                </FuseSvgIcon>
              </div>
              <div className="max-w-[50%] truncate mr-1">{item?.name}</div>
              <div className="text-slate-500">
                {" "}
                <span>{item?.price}</span>
                {/* x {item?.quantity} */}
              </div>

              <div className="ml-2 text-slate-500 max-w-[60%] truncate mr-1 overflow-x">
                <Chip
                  className="ml-1 text-8"
                  size="small"
                  color="default"
                  label={
                    <RemoveIcon
                      fontSize="small"
                      onClick={() => decreaseQty(item, cartItems)}
                    />
                  }
                />
                <span>{item?.quantity}</span>
                <Chip
                  className=" ml-1 text-8"
                  size="small"
                  color="default"
                  label={
                    <AddIcon
                      fontSize="small"
                      onClick={() => increaseQty(item, cartItems)}
                    />
                  }
                />
              </div>

              <div className="ml-auto font-medium">
                N{formatCurrency(item?.price * item?.quantity)}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 rounded-md">
              No product in cart.
            </div>
          </>
        )}
      </div>
      {cartItems && cartItems?.length > 0 && (
        <div className="box flex flex-col p-5 mt-5">
          <div className="flex justify-between">
            <input
              type="text"
              className="form-control py-3 px-4 w-full bg-slate-100 border-slate-200/60 pr-10"
              placeholder="Use coupon code..."
            />
            <button className="btn btn-primary ml-2">Apply</button>
          </div>
          <div className="mt-32 grid w-full gap-24 sm:grid-cols-4">
            <div className="sm:col-span-4">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Phone"
                    placeholder="Customer Phone"
                    id="phone"
                    error={!!errors.phone}
                    helperText={errors?.phone?.message}
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:user-circle
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    placeholder="Customer name"
                    id="name"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:user-circle
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-4">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Customer Email"
                    placeholder="Customer email"
                    id="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:user-circle
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Typography>Payment Channel</Typography>
              <Controller
                control={control}
                name="paymentmethod"
                render={({ field: { onChange, value } }) => (
                  <Select
                    sx={{
                      "& .MuiSelect-select": {
                        minHeight: "0!important",
                      },
                    }}
                    id="paymentmethod"
                    label="Payment Method"
                    placeholder="Payment Method"
                    variant="outlined"
                    fullWidth
                    onChange={onChange}
                    value={value === undefined || null ? "" : value}
                    error={!!errors.paymentmethod}
                    helperText={errors?.paymentmethod?.message}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Transfer">Transfer</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      )}

      <div className="box p-5 mt-5">
        <div className="flex">
          <div className="mr-auto">Subtotal</div>
          <div className="font-medium">NGN {formatCurrency(totalCartAmount)}</div>
        </div>
        <div className="flex mt-4">
          <div className="mr-auto">Discount</div>
          <div className="font-medium text-danger">{discount}</div>
        </div>
        <div className="flex mt-4">
          <div className="mr-auto">Tax</div>
          <div className="font-medium">NGN {formatCurrency(vatedCart)} </div>
        </div>
        <div className="flex mt-4 pt-4 border-t border-slate-200/60 dark:border-darkmode-400">
          <div className="mr-auto font-medium text-base">Total Charge</div>
          <div className="font-medium text-base">
            NGN {formatCurrency(vatedCart + discount + totalCartAmount)}
          </div>
        </div>
      </div>
      {cartItems?.length > 0 && (
        <div className="flex justify-between mt-5">
          <Chip
            className="ml-1 text-8"
            size="small"
            color="default"
            label={"Clear Items"}
            onClick={() => removeAllItemsFromInvoice()}
          />

          <Button
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) || !isValid || createInvoice?.isLoading}
            type="button"
            onClick={handleSubmit(onSubmit)}
          >
            Charge Invoice
          </Button>
        </div>
      )}
    </>
  );
};

export default DisplayCart;
