import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <div>
      <div className="grid grid-cols-1 px-4 py-5 md:py-11 md:grid-cols-3 md:px-6 lg:px-8">
        <div className="col-span-1">
          <h1 className="text-lg font-bold tracking-tight px-2 py-2 md:py-0 md:text-3xl md:pl-5">Online Grocery Web App</h1>
        </div>
        <div className="mt-3 md:m-0 md:col-span-2">
          <TableContainer>
            <Table variant="unstyled" size="sm">
              <Thead>
                <Tr>
                  <Th>Shop</Th>
                  <Th>Account</Th>
                  <Th>Career</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="hover:text-green-500">
                    <Link href="/">Home</Link>
                  </Td>
                  <Td className="hover:text-green-500">
                    <Link href="/profile">Profile</Link>
                  </Td>
                  <Td className="hover:text-green-500">
                    <Link>Join our team</Link>
                  </Td>
                </Tr>
                <Tr>
                  <Td className="hover:text-green-500">
                    <Link href="/products">Products</Link>
                  </Td>
                  <Td className="hover:text-green-500">
                    <Link href="/cart">View cart</Link>
                  </Td>
                </Tr>
                <Tr>
                  <Td className="hover:text-green-500">
                    <Link href="/products">Categories</Link>
                  </Td>
                  <Td className="hover:text-green-500">
                    <Link href="/orders">View my order</Link>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Footer;
