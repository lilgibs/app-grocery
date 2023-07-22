import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Button } from '@chakra-ui/react';
import axios from 'axios';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik, Field } from 'formik';
import { fetchProduct } from '../features/productSlice';
import { useDispatch } from 'react-redux';
import { useCustomToast } from '../hooks/useCustomToast';

function AdminDecreaseStockModal({ isOpen, onClose, productId, currStock, storeInventoryId }) {
  const dispatch = useDispatch();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const validationSchema = Yup.object().shape({
    product_stock: Yup.number()
      .max(currStock, `The maximum quantity is ${currStock}`)
      .required('Required'),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const adminToken = localStorage.getItem('admin_token')

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${productId}/decrease-stock`,
        {
          ...values,
          store_inventory_id: storeInventoryId
        },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      )
      showSuccessToast("Product stock has been successfully decreased.");
      onClose();
      dispatch(fetchProduct(productId));
    } catch (error) {
      showErrorToast("Unable to deacrease product stock.");
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
              <ModalHeader>Decrease Stock</ModalHeader>
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

export default AdminDecreaseStockModal