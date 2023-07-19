import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik, Field, setFieldValue } from 'formik';

function AddCategoryModal({ isOpen, onClose, fetchCategories, limit, resetPage }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const adminToken = localStorage.getItem("admin_token");

    const formData = new FormData();
    formData.append('product_category_name', values.product_category_name);
    formData.append('image', values.image);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/products/categories/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      alert(response.data.message);
      onClose();
      setPreviewImage(null);
      resetPage();
      fetchCategories("", 1, limit);
    } catch (error) {
      console.error(error);
      alert(error.response.data)
    }
    resetForm();
    setSubmitting(false);
  };

  const handleClose = () => {
    setPreviewImage(null);
    onClose();
  };

  const validationSchema = Yup.object().shape({
    product_category_name: Yup.string().required('Required'),
    image: Yup.mixed().required('Required')
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={{
            product_category_name: '',
            image: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <ModalHeader>Add Category</ModalHeader>
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
                    id='image'
                    name='image'
                    type="file"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);

                      if (event.currentTarget.files[0]) {
                        const url = URL.createObjectURL(event.currentTarget.files[0]);
                        setPreviewImage(url);
                      } else {
                        setPreviewImage(null);
                      }// Generate a preview image URL
                    }}
                  />
                  {previewImage &&
                    <div className='flex border mt-2 rounded-md p-5 justify-center'>
                      <img className='w-[25%]' src={previewImage} alt="Preview" />
                    </div>
                  }
                  <ErrorMessage name="image" component="div" className="text-red-500 text-xs italic" />
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

export default AddCategoryModal;
