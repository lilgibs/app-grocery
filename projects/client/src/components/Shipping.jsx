import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { Select, FormControl, Radio, RadioGroup, Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setShippingCourier, setShippingServices, resetShipping } from "../features/shippingSlice";
import { setShippingCourierCart, setShippingOption, setShippingAddress } from "../features/cartSlice";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const dispatch = useDispatch();
  const addressGlobal = useSelector((state) => state.address.address);
  const cartGlobal = useSelector((state) => state.cart.cart);
  const cartItems = cartGlobal.cart_items;
  const shippingServicesGlobal = useSelector((state) => state.shipping.shipping);
  const services = shippingServicesGlobal.services;
  const nearestStore = useSelector((state) => state.location.location.nearestStore);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [radioButton, setRadioButton] = useState(null);
  const [prevCart, setPrevCart] = useState(cartItems);
  const [cartChange, setCartChange] = useState("hidden md:invisible");
  const nav = useNavigate();

  useEffect(() => {
    if (selectedCourier === "") {
      dispatch(setShippingCourierCart(null));
      dispatch(setShippingAddress(null));
      dispatch(setShippingOption(null));
      dispatch(resetShipping());
      setRadioButton(null);
    }
  }, [selectedCourier]);

  useEffect(() => {
    let main_addresss = ["Set up your main address", 0];

    addressGlobal.forEach((x) => {
      if (x.first_address === 1) {
        main_addresss = [x.street, x.city_id];
      }
    });

    setSelectedAddress(main_addresss);
    console.log(selectedAddress);
  }, []);

  useEffect(() => {
    setPrevCart(cartItems);

    if (services.length > 0 && prevCart != cartItems) {
      setCartChange("");
      dispatch(setShippingAddress(null));
      dispatch(setShippingOption(null));
      setRadioButton(null);
    }

    if (cartItems.length === 0) {
      setCartChange("invisible");
    }
  }, [cartItems]); // reset shipping options if changes are made to cart

  const renderShippingServices = () => {
    return services.map((p) => {
      let index = services.indexOf(p);
      const regex = /[\d\-!@#$%^&*()_+=[\]{}|\\:;"'<>,.?/~`]+/g; // hanya print angka dan special characters saja
      return cartChange === "invisible" && cartItems.length > 0 ? (
        <Radio size="lg" mb="2" value={index}>
          <div className="grid grid-cols-2 gap-3">
            <div className="font-bold">{p.description} </div>
            <div>{formatRupiah(p.cost[0].value)}</div>
          </div>
          <div className="text-sm text-green-600 font-bold">Delivery time: {p.cost[0].etd.match(regex).join("")} days</div>
        </Radio>
      ) : (
        <></>
      );
    });
  };

  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleButtonClick = async () => {
    if (selectedCourier === "") {
      alert("Select your preffered courier");
    } else {
      try {
        let totalWeight = 0;

        cartItems.forEach((x) => {
          totalWeight += x.weight;
        });

        let form = {
          origin: nearestStore.store_location,
          destination: selectedAddress[1],
          weight: totalWeight,
          courier: selectedCourier,
        };

        let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cart/shipping-fee`, form);
        let courier = response.data.rajaongkir.results[0].name;
        let services = response.data.rajaongkir.results[0].costs;

        dispatch(setShippingCourier(courier));
        dispatch(setShippingServices(services));
        setCartChange("invisible");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Card variant={["unstyled", "outline", "outline"]}>
      <CardHeader className="flex justify-between">
        <div>
          <Heading size="md">Shipping option</Heading>
          <Text className="text-lg mt-3 md:text-sm md:mt-2">
            Deliver from <a className="font-bold text-green-500"> {nearestStore.store_name}</a>
          </Text>
        </div>

        <div className={cartChange}>
          <Text className="text-sm text-right text-red-500 font-bold">⚠ There is changes in your cart</Text>
          <Text className="text-xs text-right"> Update shipping options to get latest rates</Text>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-5">
        <FormControl className="flex gap-3 flex-col lg:grid lg:grid-cols-4 ">
          <div className="col-span-3 grid grid-cols-2 gap-10 lg:gap-0">
            <div>
              <Menu>
                <MenuButton as={Button} size="md" variant="outline" colorScheme="green">
                  {selectedAddress[1] === 0 ? <span> Set up main adresss </span> : <span> {selectedAddress[0]} </span>}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      nav("/profile");
                    }}
                  >
                    {selectedAddress[1] === 0 ? <span> Set up main adresss </span> : <span> Change main address </span>}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div>
              <Select placeholder="Select Courier" onChange={handleCourierChange}>
                <option value="pos">POS Indonesia</option>
                <option value="jne">JNE</option>
                <option value="tiki">TIKI</option>
              </Select>
            </div>
          </div>

          <div>
            <Button colorScheme="orange" onClick={handleButtonClick}>
              See options
            </Button>
          </div>
        </FormControl>
        <div>
          <RadioGroup
            onChange={(value) => {
              setRadioButton(Number(value));
              dispatch(setShippingCourierCart(selectedCourier));
              dispatch(setShippingAddress(selectedAddress));
              dispatch(setShippingOption(services[value]));
            }}
            value={radioButton}
          >
            <Stack direction="column">{renderShippingServices()}</Stack>
          </RadioGroup>
        </div>
      </CardBody>
    </Card>
  );
}

export default Shipping;
