import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { Icon, Select, FormControl } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setShippingCourier, setShippingServices, resetShipping } from "../features/shippingSlice";
import { setShippingOption, setShippingAddress } from "../features/cartSlice";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";

function Shipping() {
  const dispatch = useDispatch();
  const addressGlobal = useSelector((state) => state.address.address);
  const cartItemsGlobal = useSelector((state) => state.cart.cart.cart_items);
  const shippingServicesGlobal = useSelector((state) => state.shipping.shipping);
  const services = shippingServicesGlobal.services;
  const nearestStore = useSelector((state) => state.location.location.nearestStore);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [addressIndex, setAddressIndex] = useState();
  const [radioButton, setRadioButton] = useState(null);

  useEffect(() => {
    if (selectedAddress === "" || selectedCourier === "") {
      dispatch(setShippingAddress(null));
      dispatch(setShippingOption(null));
      dispatch(resetShipping());
      setRadioButton(null);
    }
  }, [selectedCourier, selectedAddress]);

  const renderAddress = () => {
    return addressGlobal.map((p) => {
      return (
        <option value={p.address_id}>
          {p.street}, {p.city_name}
        </option>
      );
    });
  };

  const renderShippingServices = () => {
    return services.map((p) => {
      let index = services.indexOf(p);
      const regex = /[\d\-!@#$%^&*()_+=[\]{}|\\:;"'<>,.?/~`]+/g; // hanya print angka dan special characters saja
      return (
        <Radio size="lg" mb="2" value={index}>
          <div className="grid grid-cols-2 gap-3">
            <div className="font-bold">{p.description} -</div>
            <div>{formatRupiah(p.cost[0].value)}</div>
          </div>
          <div className="text-sm text-green-600 font-bold">Delivery time: {p.cost[0].etd.match(regex).join("")} days</div>
        </Radio>
      );
    });
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleCourierChange = (event) => {
    setSelectedCourier(event.target.value);
  };

  const handleButtonClick = async () => {
    if (selectedAddress === "" || selectedCourier === "") {
      // console.log("Selected address: " + selectedAddress);
      // console.log("Selected courier: " + selectedCourier);

      alert("Select your address and preffered courier");
    } else {
      try {
        let i = addressGlobal.findIndex((x) => {
          return x.address_id == selectedAddress;
        });
        setAddressIndex(i);

        let destinationId = addressGlobal[i].city_id;

        let totalWeight = 0;

        cartItemsGlobal.forEach((x) => {
          totalWeight += x.weight;
        });

        let form = {
          origin: nearestStore.store_location,
          destination: destinationId,
          weight: totalWeight,
          courier: selectedCourier,
        };
        let response = await axios.post("http://localhost:8000/api/cart/getshipping", form);
        let courier = response.data.rajaongkir.results[0].name;
        let services = response.data.rajaongkir.results[0].costs;
        // console.log("kurir: " + courier);
        // console.log("kode kurir: " + courier_method);
        // console.log(services);
        dispatch(setShippingCourier(courier));
        dispatch(setShippingServices(services));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Shipping option</Heading>
        <Text className="mt-2">
          Deliver from: <a className="font-bold text-green-500"> {nearestStore.store_name}</a>
        </Text>
        {/* {selectedAddress}
        {selectedCourier}
        {addressIndex} */}
      </CardHeader>

      <CardBody className="flex flex-col gap-5">
        <FormControl className="grid grid-cols-4 gap-3">
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <Select placeholder="Select address" onChange={handleAddressChange}>
              {renderAddress()}
            </Select>

            <Select placeholder="Select Courier" onChange={handleCourierChange}>
              <option value="pos">POS Indonesia</option>
              <option value="jne">JNE</option>
              <option value="tiki">TIKI</option>
            </Select>
          </div>

          <div>
            <Button colorScheme="orange" onClick={handleButtonClick}>
              See services
            </Button>
          </div>
        </FormControl>
        <div>
          <RadioGroup
            onChange={(value) => {
              setRadioButton(Number(value));
              dispatch(setShippingAddress(addressGlobal[addressIndex]));
              dispatch(setShippingOption(services[value]));
            }}
            value={radioButton}
          >
            <Stack direction="column">{renderShippingServices()}</Stack>
          </RadioGroup>
        </div>
      </CardBody>

      {/* <CardFooter className="flex text-sm gap-1">
        <Text>Estimated delivery time:</Text>
        <Text className="text-green-500 font-bold">X Days</Text>
      </CardFooter> */}
    </Card>
  );
}

export default Shipping;
