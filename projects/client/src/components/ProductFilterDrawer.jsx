import React from 'react'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { Box, RadioGroup, Radio, Text, Divider, Stack } from "@chakra-ui/react";

function ProductFilterDrawer({ isOpen, onClose, handleSortChange, sortType, sortOrder, categories, selectedCategory, handleSetCategory }) {
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader className="bg-green-500 text-white">Filter</DrawerHeader>
        <DrawerBody>
          <RadioGroup onChange={handleSortChange} value={sortType && sortOrder ? `${sortType}_${sortOrder}` : ""}>
            <Text className="font-semibold text-lg">Sort by</Text>
            <Divider mb={"2"} />
            <Stack direction="column">
              <Radio value="" colorScheme="green">
                Default
              </Radio>
              <Radio value="price_asc" colorScheme="green">
                Lowest price
              </Radio>
              <Radio value="price_desc" colorScheme="green">
                Highest price
              </Radio>
            </Stack>
          </RadioGroup>
          <Box>
            <Text className="font-semibold text-lg mt-5">Category</Text>
            <Divider mb={"2"} />
            <div className="flex flex-col gap-2 overflow-y-auto h-[300px] pr-2">
              {categories.map((category) => (
                <div
                  className={`flex border px-4 py-1 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100 ${selectedCategory === category.label.toLowerCase() ? "font-semibold border-green-500 text-green-500" : ""
                    }`}
                  onClick={() => handleSetCategory(category.label.toLowerCase())}
                >
                  <img className="h-5" src={`${process.env.REACT_APP_API_IMG_URL + category.image}`} alt="" />
                  <p className="">{category.label}</p>
                </div>
              ))}
            </div>
          </Box>
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProductFilterDrawer