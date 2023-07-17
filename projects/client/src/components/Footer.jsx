import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

function Footer() {
  return (
    <div>
      <hr className="border-1 border-gray-300" />
      <div className="grid grid-cols-1 px-4 py-5 md:py-11 md:grid-cols-3 md:px-6 lg:px-8">
        <div className="col-span-1">
          <h1 className="text-lg font-bold tracking-tight px-2 py-2 md:py-0 md:text-3xl md:pl-5 text-green-500">
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
                  <Td className="hover:text-green-500 cursor-pointer">About Us</Td>
                  <Td className="hover:text-green-500 cursor-pointer">Login</Td>
                  <Td className="hover:text-green-500 cursor-pointer">Categories</Td>
                </Tr>
                <Tr>
                  <Td className="hover:text-green-500 cursor-pointer">Service</Td>
                  <Td className="hover:text-green-500 cursor-pointer">View Cart</Td>
                  <Td className="hover:text-green-500 cursor-pointer">Products</Td>
                </Tr>
                <Tr>
                  <Td className="hover:text-green-500 cursor-pointer">Contact</Td>
                  <Td className="hover:text-green-500 cursor-pointer">Track My Order</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <br />
        </div>
      </div>
    </div>
  )
}

export default Footer