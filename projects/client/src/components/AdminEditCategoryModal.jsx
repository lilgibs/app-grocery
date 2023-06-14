import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button } from '@chakra-ui/react';
import axios from 'axios';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik, Field } from 'formik';

function AdminEditCategoryModal({ isOpen, onClose, fetchCategories, selectedCategory }) {
  const validationSchema = Yup.object().shape({
    product_category_name: Yup.string().required('Required'),
    product_category_image: Yup.mixed().required('Required')
      .test(
        "fileSize",
        "File too large",
        value => value && value.size <= 1024 * 1024  // file size <= 1MB
      )
      .test(
        "fileFormat",
        "Unsupported Format",
        value => value && (value.type === "image/jpeg" || value.type === "image/png")
      ),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('product_category_name', values.product_category_name);
    formData.append('product_category_image', values.product_category_image);

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
    resetForm();
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={{
            product_category_name: selectedCategory ? selectedCategory.product_category_name : '',
            product_category_image: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <ModalHeader>Edit Category</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Category Name</FormLabel>
                  <Field
                    as={Input}
                    name='product_category_name'
                    placeholder="Enter Category Name"
                  />
                  <ErrorMessage name="product_category_name" component="div" className="text-red-500 text-xs italic" />
                </FormControl>
                <FormControl>
                  <FormLabel>Category Image</FormLabel>
                  <Input
                    id='product_category_image'
                    name='product_category_image'
                    type="file"
                    onChange={(event) => {
                      setFieldValue("product_category_image", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage name="product_category_image" component="div" className="text-red-500 text-xs italic" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} type="submit" disabled={isSubmitting}>
                  Save
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default AdminEditCategoryModal;
