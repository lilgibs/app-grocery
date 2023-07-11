import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { getAddress } from "../features/addressSlice";
import { fetchCity } from "../api/CityApi";
import { fetchProvince } from "../api/ProvinceApi";
import { getCoordinates } from "../api/UtilApi";
import {
  addAddress,
  deleteAddress,
  editAddress,
  setMainAddress,
} from "../api/AddressApi";

function Address() {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const userAddress = useSelector((state) => state.address.address);
  const userToken = localStorage.getItem("user_token");
  const [addresses, setAddresses] = useState(userAddress);
  const [selectedAddress, setselectedAddress] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const initialRef = useRef();

  const handleEditAddress = (address) => {
    setselectedAddress(address);
    onEditOpen();
  };

  const renderAddresses = () => {
    return addresses.map((address) => (
      <div
        key={address.address_id}
        className="w-full  p-2 border border-pink-500 rounded-md  shadow-md"
      >
        <div className="flex">
          <div className="flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2 gap-2 px-1">
            <div>
              <p className="text-lg font-semibold text-pink-500 ">Alamat:</p>
              <p className="text-md font-medium">
                {address.street}, {address.city_name}, {address.province_name}
              </p>
              {address.first_address ? (
                <p className="inline-block w-auto border border-green-500 rounded p-1 my-1 text-green-500 text-sm">
                  Main Address
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1 items-center w-1/2 border-l-2">
            <div
              className="px-2 py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => handleEditAddress(address)}
            >
              <FaPen size={15} />
              <p>Edit</p>
            </div>
            <div
              className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={async () => {
                await deleteAddress(address.address_id, userToken);
                dispatch(getAddress(userGlobal.user_id, userToken));
              }}
            >
              <FaTrash size={15} />
              <p>Delete</p>
            </div>
            {address.first_address ? null : (
              <button
                className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 font-semibold text-white w-1/2 flex items-center justify-center"
                onClick={async () => {
                  await setMainAddress(
                    address.address_id,
                    userGlobal.user_id,
                    userToken
                  );
                  dispatch(getAddress(userGlobal.user_id, userToken));
                }}
              >
                Set as Main Address
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const ModalAddAddress = () => {
    const [addressStreet, setaddressStreet] = useState("");
    const [addressCity, setaddressCity] = useState("");
    const [addressProvince, setaddressProvince] = useState("");
    const [streetError, setStreetError] = useState("");
    const [cityError, setCityError] = useState("");
    const [provinceError, setProvinceError] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState("");

    const handleSubmit = async () => {
      let isValid = true;
      if (addressStreet.trim() === "") {
        setStreetError("Street is required");
        isValid = false;
      } else {
        setStreetError("");
      }

      if (addressCity.trim() === "") {
        setCityError("City is required");
        isValid = false;
      } else {
        setCityError("");
      }

      if (addressProvince.trim() === "") {
        setProvinceError("Province is required");
        isValid = false;
      } else {
        setProvinceError("");
      }

      if (isValid) {
        const coordinates = await getCoordinates(
          `${addressStreet}, ${addressCity}, ${addressProvince}`
        );

        const data = {
          street: addressStreet,
          city: addressCity,
          province: addressProvince,
          longitude: coordinates.lng,
          latitude: coordinates.lat,
          user_id: userGlobal.user_id,
        };

        await addAddress(data, userToken);
        onAddClose();
        dispatch(getAddress(userGlobal.user_id, userToken));
      }
    };

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isAddOpen}
        onClose={onAddClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={provinceError !== ""}>
              <FormLabel>Province</FormLabel>
              <Select
                ref={initialRef}
                placeholder="Select Province"
                value={addressProvince}
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setaddressProvince(selectedProvince);
                  const province = provinceOptions.find(
                    (province) => province.province_name === selectedProvince
                  );
                  setSelectedProvinceId(province ? province.province_id : "");
                  setaddressCity("");
                }}
              >
                {provinceOptions.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_name}
                  >
                    {province.province_name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{provinceError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={cityError !== ""}>
              <FormLabel>City</FormLabel>
              <Select
                placeholder="Select City"
                value={addressCity}
                onChange={(e) => setaddressCity(e.target.value)}
                isRequired={true}
              >
                {cityOptions
                  .filter((city) => city.province_id === selectedProvinceId)
                  .map((city) => (
                    <option key={city.city_id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>{cityError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={streetError !== ""}>
              <FormLabel>Street</FormLabel>
              <Input
                placeholder="Enter Street"
                value={addressStreet}
                onChange={(e) => setaddressStreet(e.target.value)}
              />
              <FormErrorMessage>{streetError}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" onClick={onAddClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalEditAddress = () => {
    const [addressStreet, setaddressStreet] = useState("");
    const [addressCity, setaddressCity] = useState("");
    const [addressProvince, setaddressProvince] = useState("");
    const [streetError, setStreetError] = useState("");
    const [cityError, setCityError] = useState("");
    const [provinceError, setProvinceError] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState("");

    const handleSubmit = async () => {
      let isValid = true;
      if (addressStreet.trim() === "") {
        setStreetError("Street is required");
        isValid = false;
      } else {
        setStreetError("");
      }

      if (addressCity.trim() === "") {
        setCityError("City is required");
        isValid = false;
      } else {
        setCityError("");
      }

      if (addressProvince.trim() === "") {
        setProvinceError("Province is required");
        isValid = false;
      } else {
        setProvinceError("");
      }

      if (isValid) {
        const coordinates = await getCoordinates(
          `${addressStreet}, ${addressCity}, ${addressProvince}`
        );

        const data = {
          street: addressStreet,
          city: addressCity,
          province: addressProvince,
          longitude: coordinates.lng,
          latitude: coordinates.lat,
        };

        await editAddress(selectedAddress.address_id, data, userToken);
        onEditClose();
        dispatch(getAddress(userGlobal.user_id, userToken));
      }
    };

    useEffect(() => {
      if (selectedAddress) {
        setaddressStreet(selectedAddress.street);
        setaddressCity(selectedAddress.city_name);
        setaddressProvince(selectedAddress.province_name);
        setSelectedProvinceId(selectedAddress.province_id);
      }
    }, [selectedAddress]);

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={provinceError !== ""}>
              <FormLabel>Province</FormLabel>
              <Select
                placeholder="Select Province"
                value={addressProvince}
                onChange={(e) => {
                  const selectedProvince = e.target.value;
                  setaddressProvince(selectedProvince);
                  const province = provinceOptions.find(
                    (province) => province.province_name === selectedProvince
                  );
                  setSelectedProvinceId(province ? province.province_id : "");
                  setaddressCity("");
                }}
              >
                {provinceOptions.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_name}
                  >
                    {province.province_name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{provinceError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={cityError !== ""}>
              <FormLabel>City</FormLabel>
              <Select
                placeholder="Select City"
                value={addressCity}
                onChange={(e) => setaddressCity(e.target.value)}
                isRequired={true}
              >
                {cityOptions
                  .filter((city) => city.province_id === selectedProvinceId)
                  .map((city) => (
                    <option key={city.city_id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
              </Select>
              <FormErrorMessage>{cityError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={streetError !== ""}>
              <FormLabel>Street</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Enter Street"
                value={addressStreet}
                onChange={(e) => setaddressStreet(e.target.value)}
              />
              <FormErrorMessage>{streetError}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    setAddresses(userAddress);
  }, [userAddress]);

  useEffect(() => {
    const fetchCityOptions = async () => {
      const cityOptions = await fetchCity();
      setCityOptions(cityOptions);
    };

    const fetchProvinceOptions = async () => {
      const provinceOptions = await fetchProvince();
      setProvinceOptions(provinceOptions);
    };

    fetchCityOptions();
    fetchProvinceOptions();
  }, []);

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto my-5">
      <div className="px-8 py-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-4 rounded-md mb-8">
          <p className="font-semibold text-green-500 text-lg">
            Address Management
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAddOpen}
            className="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
          >
            <FaPlus size={15} className="mr-2" /> Add Address
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {renderAddresses()}
          <ModalAddAddress />
          <ModalEditAddress />
        </div>
      </div>
    </div>
  );
}

export default Address;
