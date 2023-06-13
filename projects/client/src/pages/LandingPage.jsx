import React, { useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Image, Stack, Heading, Text } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

const LandingPage = () => {
  const dispatch = useDispatch();
  const nearestStore = useSelector((state) => state.location.location.nearestStore.store_name);

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
              <Button variant="outline" color="green.500" size="sm" p="3" borderRadius="full">
                More categories
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-5">
            <Button bg="green.200" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 1
            </Button>
            <Button bg="gray.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 2
            </Button>
            <Button bg="pink.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 3
            </Button>
            <Button bg="blue.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 4
            </Button>
            <Button bg="orange.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 5
            </Button>
            <Button bg="pink.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 6
            </Button>
            <Button bg="green.200" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 7
            </Button>
            <Button bg="gray.100" color="gray.700" h={{ base: "80px", md: "120px", lg: "150px" }} w={{ base: "80px", md: "120px", lg: "150px" }} fontSize="sm">
              Category 8
            </Button>
          </div>
        </div>

        <br />

        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Popular
                <a className="text-green-400"> Products</a>
              </h1>
            </div>

            <div className=" md:justify-self-end">
              <Button variant="outline" color="green.500" size="sm" p="3" borderRadius="full">
                Browse all products
              </Button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Card className="drop-shadow-md" h={{ base: "350px", md: "550px" }}>
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 1</Heading>

                  <Text fontSize="lg">Rp30.000</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <Button bg="green.300" color="white">
                  See details
                </Button>
              </CardFooter>
            </Card>

            <Card className="drop-shadow-md" h={{ base: "350px", md: "550px" }}>
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 2</Heading>

                  <Text fontSize="lg">Rp30.000</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <Button bg="green.300" color="white">
                  See details
                </Button>
              </CardFooter>
            </Card>

            <Card className="drop-shadow-md" h={{ base: "350px", md: "550px" }}>
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 3</Heading>

                  <Text fontSize="lg">Rp30.000</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <Button bg="green.300" color="white">
                  See details
                </Button>
              </CardFooter>
            </Card>

            <Card className="drop-shadow-md" h={{ base: "350px", md: "550px" }}>
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 4</Heading>

                  <Text fontSize="lg">Rp30.000</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <Button bg="green.300" color="white">
                  See details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <br />

        <div className="text-center mx-7 my-8 py-8 lg:my-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Online Grocery Web App</h1>
          <p className="mt-8 text-gray-600 text-md md:text-xl">Stay home and get your daily needs delivered to your doorstep</p>
          <div className="mt-8 mx-5 flex flex-col items-center justify-center gap-2 md:flex-row">
            <Button bg="green.400" color="white" variant="solid" size="md" className="w-full sm:w-auto">
              Register
            </Button>
            <Button colorScheme="gray" variant="outline" size="md" className="w-full sm:w-auto mt-2 sm:mt-0">
              Learn more →
            </Button>
          </div>
        </div>

        <br />

        <hr className="border-1 border-gray-300" />
        <div className="grid grid-cols-1 px-4 py-5 md:py-11 md:grid-cols-3 md:px-6 lg:px-8">
          <div className="col-span-1">
            <h1 className="text-lg font-bold tracking-tight px-2 py-2 md:py-0 md:text-3xl md:pl-5">Online Grocery Web App</h1>
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
