import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Image, Stack, Heading, Text, Divider } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";

const LandingPage = () => {
  return (
    <div className="bg-white">
      <div className="relative isolate">
        <div className="grid grid-cols-3 gap-4 py-10 px-20 bg-sky-100">
          <div className="col-span-2">
            <Card align="center">
              <Tabs variant="soft-rounded" colorScheme="green">
                <CardHeader></CardHeader>
                <CardBody py="20">
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

          <div>
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
        <div className="px-20 py-5">
          <div className="grid grid-cols-2">
            <div>
              <h1 className="text-6xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Shop
                <a className="text-green-400"> by Categories</a>
              </h1>
            </div>

            <div className="justify-self-end">
              <Button variant="outline" color="green.500" size="sm" p="5" borderRadius="200">
                More categories
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <Button bg="green.400" color="white" h="150px" w="150px" size="lg">
              Category 1
            </Button>
            <Button bg="green.400" color="white" h="150px" w="150px" size="lg">
              Category 2
            </Button>
            <Button bg="green.400" color="white" h="150px" w="150px" size="lg">
              Category 3
            </Button>
            <Button bg="green.400" color="white" h="150px" w="150px" size="lg">
              Category 4
            </Button>
            <Button bg="green.400" color="white" h="150px" w="150px" size="lg">
              Category 5
            </Button>
          </div>
        </div>

        <br />

        <div className="px-20 py-5">
          <div className="grid grid-cols-2">
            <div>
              <h1 className="text-6xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Popular
                <a className="text-green-400"> Products</a>
              </h1>
            </div>

            <div className="justify-self-end">
              <Button variant="outline" color="green.500" size="sm" p="5" borderRadius="200">
                Browse all products
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-center  gap-7">
            <Card maxW="sm">
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" w="300px" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 1</Heading>
                  <Text>Product description</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <ButtonGroup spacing="3">
                  <Text color="gray.500" fontSize="2xl">
                    $450
                  </Text>

                  <Button variant="solid" bg="green.100" color="green.600">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" w="300px" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 1</Heading>
                  <Text>Product description</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <ButtonGroup spacing="3">
                  <Text color="gray.500" fontSize="2xl">
                    $450
                  </Text>

                  <Button variant="solid" bg="green.100" color="green.600">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" w="300px" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 1</Heading>
                  <Text>Product description</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <ButtonGroup spacing="3">
                  <Text color="gray.500" fontSize="2xl">
                    $450
                  </Text>

                  <Button variant="solid" bg="green.100" color="green.600">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>

            <Card maxW="sm">
              <CardBody>
                <Image src="https://sb-assets.sgp1.cdn.digitaloceanspaces.com/product/main_image/14085/3c8a7d0d-4389-4fee-a008-ddf14e506769.jpg" alt="Kailan" borderRadius="lg" w="300px" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">Product 1</Heading>
                  <Text>Product description</Text>
                </Stack>
              </CardBody>

              <CardFooter>
                <ButtonGroup spacing="3">
                  <Text color="gray.500" fontSize="2xl">
                    $450
                  </Text>

                  <Button variant="solid" bg="green.100" color="green.600">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          </div>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-5 gap-4 bg-gray-100 px-10 py-10 mt-12">
          <div className="col-span-3"></div>
          <div className="col-span-2">
            <TableContainer>
              <Table variant="unstyled">
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th>Account</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>About Us</Td>
                    <Td>Sign in</Td>
                  </Tr>
                  <Tr>
                    <Td>Service</Td>
                    <Td>View Cart</Td>
                  </Tr>
                  <Tr>
                    <Td>Contact</Td>
                    <Td>Track My Order</Td>
                  </Tr>
                </Tbody>
                {/* <Tfoot>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Tfoot> */}
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
