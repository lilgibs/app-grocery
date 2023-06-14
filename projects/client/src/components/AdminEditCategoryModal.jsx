import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button } from '@chakra-ui/react';
import axios from 'axios';

function AdminEditCategoryModal({ isOpen, onClose, fetchCategories, selectedCategory }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null)

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('product_category_name', categoryName)
    formData.append('product_category_image', categoryImage)

    try {

      const response = await axios.put(
        `http://localhost:8000/api/admin/products/categories/${selectedCategory.product_category_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert(response.data.message);
      onClose();
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.product_category_name);
    }
  }, [selectedCategory]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Category Name</FormLabel>
            <Input
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Category Image</FormLabel>
            <Input
              type='file'
              onChange={(e) => setCategoryImage(e.target.files[0])}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AdminEditCategoryModal