import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { Icon, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setShippingCourier, setShippingServices, resetShipping } from "../features/shippingSlice";
import { setShippingOption, setShippingAddress } from "../features/cartSlice";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";

function Shipping() {
  const dispatch = useDispatch();
  const addressGlobal = useSelector((state) => state.address.address);
  const shippingServicesGlobal = useSelector((state) => state.shipping.shipping);
  const services = shippingServicesGlobal.services;
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [value, setValue] = useState("");

  const renderAddress = () => {
    return addressGlobal.map((p) => {
      return (
        <option value={p.city_id}>
          {p.city_id}-{p.city_name}
        </option>
      );
    });
  };

  const renderShippingServices = () => {
    return services.map((p) => {
      let index = services.indexOf(p);
      return (
        <Radio size="lg" mb="2" value={index}>
          {p.description}: {p.cost[0].etd} days
          <br />
          {formatRupiah(p.cost[0].value)}
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
        let form = {
          origin: "48", // batam store - HARUS EDIT !!!!
          destination: selectedAddress,
          weight: 100,
          courier: selectedCourier,
        };

        let response = await axios.post("http://localhost:8000/api/cart/getshipping", form);

        let courier = response.data.rajaongkir.results[0].name;
        let courier_method = response.data.rajaongkir.results[0].code;
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
      </CardHeader>

      <CardBody className="flex flex-col gap-5">
        {/* <div>
          <Select placeholder="Select address">{renderAddress()}</Select>
        </div> */}

        <FormControl className="grid grid-cols-3 gap-3">
          <div className="col-span-2 grid grid-cols-2 gap-2">
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
              See delivery services
            </Button>
          </div>
        </FormControl>
        <div>
          <RadioGroup
            onChange={(value) => {
              // console.log(services[value]);
              setValue(value);
              dispatch(setShippingAddress(selectedAddress));
              dispatch(setShippingOption(services[value]));
            }}
          >
            <Stack direction="column">
              {/* <Radio value="1">First</Radio>
              <Radio value="2">Second</Radio>
              <Radio value="3">Third</Radio> */}
              {renderShippingServices()}
            </Stack>
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
