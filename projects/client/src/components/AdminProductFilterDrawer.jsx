import React, { useState } from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Box, Text, Divider } from '@chakra-ui/react';
import Select from 'react-select';

function AdminProductFilterDrawer({ isOpen, onClose, categoryOptions, sortOptions, handleCategoryChange,  handleSortChange, selectedCategory, selectedSortOption }) {
  const [isClearable, setIsClearable] = useState(true);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader className="bg-pink-500 text-white" borderBottomWidth="1px">Filter</DrawerHeader>
          <DrawerBody>
            <Box className='flex flex-col gap-5'>
              <Box>
                <Text className="font-semibold text-lg">Category</Text>
                <Divider mb={"2"} />
                <Select
                  id="product_category_id"
                  name="product_category_id"
                  value={selectedCategory}
                  placeholder="Category"
                  isClearable={isClearable}
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                />
              </Box>
              <Box>
                <Text className="font-semibold text-lg">Sorting</Text>
                <Divider mb={"2"} />
                <Select
                  id="product_sort_id"
                  name="product_sort_id"
                  value={selectedSortOption}
                  isClearable={isClearable}
                  placeholder="Sort by"
                  options={sortOptions}
                  onChange={handleSortChange}
                />
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default AdminProductFilterDrawer;
