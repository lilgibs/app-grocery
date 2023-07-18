import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button } from '@chakra-ui/react';
import axios from 'axios';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik, Field } from 'formik';
import { fetchProduct } from '../features/productSlice';
import { useDispatch } from 'react-redux';

function AdminIncreaseStockModal({ isOpen, onClose, productId, currStock }) {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    product_stock: Yup.number()
    .min(1, 'The minimum quantity is 1')
    .required('Required'),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const adminToken = localStorage.getItem('admin_token')
    console.log(values)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${productId}/increase-stock`, values,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      )
      alert(response.data.message)
      onClose();
      dispatch(fetchProduct(productId));
    } catch (error) {
      console.log(error)
    }
    resetForm();
    setSubmitting(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={{
            product_stock: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <ModalHeader>Increase Stock</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormLabel>Product quantity</FormLabel>
                <Field
                  as={Input}
                  name='product_stock'
                  placeholder="Enter stock quantity"
                />
                <ErrorMessage name="product_stock" component="div" className="text-red-500 text-xs italic" />
              </ModalBody>
              <ModalFooter>
                <Button mr={2} colorScheme='green' type='submit' disabled={isSubmitting}>Save</Button>
                <Button colorScheme='red' onClick={onClose}>Close</Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default AdminIncreaseStockModal