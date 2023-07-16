import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Image, Stack, Heading, Text } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/userApi";
import { fetchCategories } from "../api/adminCategoryApi";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const userToken = localStorage.getItem("user_token");

  const { store_id, store_name } = useSelector(
    (state) => state.location.location.nearestStore
  );

  const dispatch = useDispatch();
  const nearestStore = useSelector(
    (state) => state.location.location.nearestStore.store_name
  );
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.formattedCategories);
      console.log(categories.slice(0, 5));
    };

    const getProducts = async () => {
      const result = await fetchProducts(store_id);
      setProducts(result.products);
    };
    getProducts();
    getCategories();
  }, [store_id]);

  const formatProductName = (productName) => {
    return productName.replace(/\s+/g, "-").toLowerCase();
  };

  return (
    <div className="bg-white">
      <div className="relative isolate lg:px-20">
        <div className="px-4 my-5 md:px-10">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            Nearest store:
            <a className="text-green-500"> {nearestStore}</a>
          </h3>
        </div>
        <div className="bg-sky-100 rounded-lg grid grid-col-1 gap-4 py-10 px-4 lg:my-5 md:px-10 md:grid-cols-3 lg:px-20">
          <div className="col-span-1 md:col-span-2">
            <Card align="center">
              <Tabs variant="soft-rounded" colorScheme="green">
                <CardHeader></CardHeader>
                <CardBody py={{ base: "10", md: "20" }}>
                  <TabPanels>
                    <TabPanel>
                      <p>Promo 1</p>
                    </TabPanel>

                    <TabPanel>
                      <p>Promo 2</p>
                    </TabPanel>

                    <TabPanel>
                      <p>Promo 3</p>
                    </TabPanel>
                  </TabPanels>
                </CardBody>

                <CardFooter>
                  <TabList gap="1">
                    <Tab bg="gray.100"></Tab>
                    <Tab bg="gray.100"></Tab>
                    <Tab bg="gray.100"></Tab>
                  </TabList>
                </CardFooter>
              </Tabs>
            </Card>
          </div>

          <div className="hidden md:block">
            <Card align="center">
              <CardHeader></CardHeader>
              <CardBody py="20">promo 4</CardBody>

              <CardFooter m="1">
                <Button bg="green.200" color="white">
                  Shop Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <br />

        <div className="px-4 py-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Shop
                <a className="text-green-400"> by Categories</a>
              </h1>
            </div>

            <div className="mt-5 md:justify-self-end md:mt-0">
              <Button
                variant="outline"
                color="green.500"
                size="sm"
                p="3"
                borderRadius="full"
                onClick={() => navigate("/products")}
              >
                More categories
              </Button>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-center">
            {categories.map((category) => (
              <Button
                bg={
                  categories.indexOf(category) % 2 === 0
                    ? "green.200"
                    : "pink.100"
                }
                color="gray.700"
                h={{ base: "80px", md: "120px", lg: "150px" }}
                w={{ base: "80px", md: "120px", lg: "150px" }}
                fontSize="sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <br />

        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Browse
                <a className="text-green-400"> our Products</a>
              </h1>
            </div>

            <div className=" md:justify-self-end">
              <Button
                variant="outline"
                color="green.500"
                size="sm"
                p="3"
                borderRadius="full"
                onClick={() => navigate("/products")}
              >
                Browse all products
              </Button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-2">
            {products.slice(0, 4).map((product) => (
              <Card
                variant="elevated"
                className="cursor-pointer"
                onClick={() =>
                  navigate(
                    `/products/${formatProductName(product.product_name)}`
                  )
                }
              >
                <Image
                  src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png"
                  alt="Green double couch with wooden legs"
                  borderTopRadius="lg"
                />
                <CardHeader padding={"2"}>
                  <Heading
                    className="line-clamp-2"
                    size="sm"
                    fontWeight={"normal"}
                  >
                    {product.product_name}
                  </Heading>
                </CardHeader>
                <CardBody padding={"2"}>
                  <Text className="font-semibold">
                    {formatRupiah(product.product_price)}
                  </Text>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <br />

        <div className="text-center mx-7 my-8 py-8 lg:my-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Online Grocery Web App
          </h1>
          <p className="mt-8 text-gray-600 text-md md:text-xl">
            Stay home and get your daily needs delivered to your doorstep
          </p>
          <div className="mt-8 mx-5 flex flex-col items-center justify-center gap-2 md:flex-row">
            {userToken ? (
              <>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/products")}
                >
                  Start shopping
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
                <Button
                  colorScheme="gray"
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto mt-2 sm:mt-0"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>

        <br />

        <hr className="border-1 border-gray-300" />
        <div className="grid grid-cols-1 px-4 py-5 md:py-11 md:grid-cols-3 md:px-6 lg:px-8">
          <div className="col-span-1">
            <h1 className="text-lg font-bold tracking-tight px-2 py-2 md:py-0 md:text-3xl md:pl-5">
              Online Grocery Web App
            </h1>
          </div>
          <div className="mt-3 md:m-0 md:col-span-2">
            <TableContainer>
              <Table variant="unstyled" size="sm">
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th>Account</Th>
                    <Th>Shop</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td className="hover:text-green-500">About Us</Td>
                    <Td className="hover:text-green-500">Login</Td>
                    <Td className="hover:text-green-500">Categories</Td>
                  </Tr>
                  <Tr>
                    <Td className="hover:text-green-500">Service</Td>
                    <Td className="hover:text-green-500">View Cart</Td>
                    <Td className="hover:text-green-500">Products</Td>
                  </Tr>
                  <Tr>
                    <Td className="hover:text-green-500">Contact</Td>
                    <Td className="hover:text-green-500">Track My Order</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
