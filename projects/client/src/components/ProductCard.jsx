import React from 'react'
import { Box, Card, CardBody, CardFooter, CardHeader, Heading, Image, Text } from "@chakra-ui/react";
import { formatRupiah } from "../utils/formatRupiah";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  function formatProductName(productName) {
    return productName.replace(/\s+/g, "-").toLowerCase();
  }

  return (
    <div>
      <Card
        variant="elevated"
        className="cursor-pointer"
      // onClick={() => navigate(`/products/${formatProductName(product.product_name)}`)}
      >
        <Link to={`/products/${formatProductName(product.product_name)}`}>
          <Image src={`${process.env.REACT_APP_API_IMG_URL + product.image_url}`} alt="Green double couch with wooden legs" borderTopRadius="lg" />
          <Box className="h-36">
            <CardHeader py={"1"} px={"2"}>
              <Heading className="line-clamp-2" size="xs" fontWeight={"normal"}>
                {" "}
                {product.product_name}
              </Heading>
            </CardHeader>
            <CardBody py={"1"} px={"2"}>
              {
                product.discounted_price ? (
                  <Box className="flex flex-col gap-1">
                    <Text className="font-semibold">{formatRupiah(product.discounted_price)}</Text>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      {product.discount_value_type == "PERCENTAGE" ?
                        (<Text className="bg-red-100 text-red-500 font-bold p-1 rounded">{parseInt(product.discount_value)}%</Text>) : null}
                      <Text className="line-through">{formatRupiah(product.product_price)}</Text>
                    </div>
                  </Box>
                ) : (
                  <Box>
                    <Text className="font-semibold">{formatRupiah(product.product_price)}</Text>
                  </Box>
                )
              }
            </CardBody>
            <CardFooter py={"1"} px={"2"}>
              {/* <Text className="text-xs font-semibold w-full text-end text-neutral-500">Terjual 0</Text> */}
            </CardFooter>
          </Box>
        </Link>
      </Card>
    </div>
  )
}

export default ProductCard