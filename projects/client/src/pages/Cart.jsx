import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Center } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Card, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { fetchCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import CartItem from "../components/CartItem";
import Shipping from "../components/Shipping";
import axios from "axios";
import Select from "react-select";

const Cart = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const locationGlobal = useSelector((state) => state.location.location);
  const cartGlobal = useSelector((state) => state.cart.cart);
  const cartItems = cartGlobal.cart_items;
  const cartShippingOption = cartGlobal.shipping_option;
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [voucherMin, setVoucherMin] = useState();

  //vouchers
  useEffect(() => {
    setVouchers([]); // reset
    const getVouchers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/cart/voucher/?storeId=${locationGlobal.nearestStore.store_id}`);
        if (response.data.length > 0) {
          setVouchers(response.data);
        }

        // console.log("Vouchers:");
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getVouchers();
  }, []);

  const handleVoucherChange = (event) => {
    // let obj = vouchers.find((o) => o.voucher_id === event.target.value);

    // setSelectedVoucher(obj);
    // console.log(selectedVoucher);

    const voucher = vouchers.find((object) => object.voucher_id === parseInt(event.target.value));

    if (voucher) {
      setSelectedVoucher(voucher);
    } else {
      setSelectedVoucher("No voucher selected");
    }
  };

  useEffect(() => {
    console.log("Voucher changed to: ");
    console.log(selectedVoucher);
  }, [selectedVoucher]); // checker

  //-------------------------------------

  useEffect(() => {
    dispatch(fetchCart(userGlobal.user_id, locationGlobal.nearestStore.store_id));
  }, [locationGlobal.nearestStore.store_id]);

  useEffect(() => {
    // cari subtotal
    let sumSubtotal = 0;
    cartItems.forEach((x) => {
      sumSubtotal += Number(x.subtotal);
      setSubtotal(sumSubtotal); // get subtotal
    });

    // voucher applied
    if (selectedVoucher.minimum_amount > sumSubtotal) {
      setVoucherMin(`Min. order ${formatRupiah(selectedVoucher.minimum_amount)}`);
    } else {
      setVoucherMin("");
      if (selectedVoucher.voucher_value_type === "NOMINAL") {
        let priceWithVoucher = sumSubtotal - parseInt(selectedVoucher.voucher_value);
        setSubtotal(priceWithVoucher);
      } else if (selectedVoucher.voucher_value_type === "PERCENTAGE") {
        let priceWithVoucher = sumSubtotal - sumSubtotal * (parseInt(selectedVoucher.voucher_value) / 100);
        setSubtotal(priceWithVoucher);
      }
    }

    let sumTotal = cartItems.length == 0 ? 0 : cartShippingOption == null ? subtotal : subtotal + cartShippingOption.cost[0].value;

    setTotal(sumTotal); //get total
  });

  const renderCartItems = () => {
    return cartItems.map((p, index) => {
      return (
        <CartItem
          //
          key={index}
          cart_id={p.cart_id}
          product_id={p.product_id}
          product={p.product_name}
          price={p.product_price}
          discount_value={p.discount_value}
          discounted_price={p.discounted_price}
          weight={p.weight}
          quantity={p.quantity}
          stock={p.quantity_in_stock}
          subtotal={p.subtotal}
          buy1get1={p.buy1get1}
        />
      );
    });
  };

  const handleOrder = async () => {
    try {
      let order = {
        user_id: userGlobal.user_id,
        store_id: locationGlobal.nearestStore.store_id,
        order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        shipping_courier: cartGlobal.shipping_courier_cart,
        shipping_type: cartGlobal.shipping_option.service,
        shipping_price: cartGlobal.shipping_option.cost[0].value,
        total_price: total,
        order_status: "Waiting for payment",
        address_id: cartGlobal.shipping_address,
        order_details: cartItems,
      };

      const response = await axios.post("http://localhost:8000/api/order/", order);

      alert(response.data.message);
      dispatch(fetchCart(userGlobal.user_id, locationGlobal.nearestStore.store_id));
    } catch (error) {
      alert(`Add order fails.`);
    }
  };

  return (
    <div className="mx-20 my-10">
      {userGlobal.user_id > 0 ? (
        <>
          <div>
            <h1 className="text-3xl mb-10 font-semibold tracking-tight text-gray-900 ">Shopping Cart</h1>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>

                  <Tbody>{renderCartItems()}</Tbody>

                  <TableCaption className="pt-10">
                    <div className="flex flex-row justify-between">
                      <Button
                        bg="green.100"
                        color="green.500"
                        onClick={() => {
                          nav("/products");
                        }}
                      >
                        ← Continue Shopping
                      </Button>
                    </div>
                  </TableCaption>
                </Table>
              </TableContainer>
            </div>

            <div className=" flex flex-col gap-2">
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box className="flex justify-between">
                      <Heading size="sm">Subtotal</Heading>
                      {cartItems.length == 0 ? <>Your cart is empty</> : <>{formatRupiah(subtotal)}</>}
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Voucher</Heading>
                      {/* Vouchers */}
                      <div className="flex flex-col gap-1">
                        <div>
                          <Select
                            id="voucherSelect"
                            options={vouchers}
                            value={selectedVoucher}
                            onChange={(value) => {
                              setSelectedVoucher(value);
                            }}
                            getOptionLabel={(option) => option.voucher_name}
                            getOptionValue={(option) => option.voucher_id}
                            placeholder="Select vouchers"
                          />
                        </div>
                        <Text className="text-red-500 font-semibold text-sm"> {voucherMin}</Text>

                        {/* <Button
                          onClick={() => {
                            console.log(vouchers);
                          }}
                        >
                          all vouchers
                        </Button> */}
                      </div>
                      {/*  */}
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Shipping</Heading>
                      <div className="text-right">
                        {cartShippingOption == null ? <div className="text-green-500 font-bold">⚠ Select shipping option</div> : <>{formatRupiah(cartShippingOption.cost[0].value)}</>}
                        {cartShippingOption == null ? (
                          <></>
                        ) : (
                          <div className="text-xs font-bold text-green-500 ">
                            {cartGlobal.shipping_address.street} ( {cartGlobal.shipping_option.service} )
                          </div>
                        )}
                      </div>
                    </Box>
                    <Box className="flex justify-between font-bold text-3xl">
                      <Text>Total</Text>
                      <Text>{formatRupiah(total)}</Text>
                    </Box>
                  </Stack>
                </CardBody>

                <CardFooter>
                  <Button variant="solid" colorScheme="green" minW="100%" isDisabled={cartItems.length == 0 || cartShippingOption == null ? true : false} onClick={handleOrder}>
                    Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-5">
            <div>{cartItems.length == 0 ? <></> : <Shipping />}</div>
            <div></div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl my-10 font-semibold tracking-tight text-gray-900 ">Shopping Cart</h1>
          </div>

          <div className="text-center mx-7 py-5">
            <p className="mt-8 text-gray-600 text-md md:text-xl">Login to view your cart</p>
            <div className="mt-5 mx-5 flex flex-col items-center justify-center gap-2 md:flex-row">
              <Stack direction="row" spacing={2}>
                <Button
                  colorScheme="green"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    nav("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  onClick={() => {
                    nav("/register");
                  }}
                >
                  Register
                </Button>
              </Stack>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
