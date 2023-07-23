import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { addVoucher, deleteVoucher, getVoucher } from "../api/voucherApi";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useCustomToast } from "../hooks/useCustomToast";

function AdminVoucher() {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const adminData = useSelector((state) => state.admin.admin);
  const adminToken = localStorage.getItem("admin_token");
  const [discounts, setDiscounts] = useState([]);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const initialRef = useRef();

  const handleDeleteVoucher = (id) => {
    setToBeDeleted(id);
    setModalOpen(true);
  };

  const ConfirmDeleteVoucher = async () => {
    setModalOpen(false);
    try {
      const response = await deleteVoucher(toBeDeleted, adminToken);

      showSuccessToast(response);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setToBeDeleted(null); // Reset the toBeDeleted state
      window.location.reload();
    }
  };

  const ModalAddDiscount = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      try {
        const data = {
          discount_value_type: values.discount_value_type,
          discount_value: values.discount_value,
          start_date: values.start_date,
          end_date: values.end_date,
          store_id: adminData.store_id,
          minimum_amount: values.minimum_amount,
          voucher_name: values.voucher_name,
        };

        await addVoucher(data, adminToken);

        showSuccessToast("Promo added successfully.");
        onAddClose();
        resetForm();
        setSubmitting(false);
        window.location.reload();
      } catch (error) {
        showErrorToast(error);
      }
    };

    const validationSchema = Yup.object().shape({
      discount_value_type: Yup.string().required(
        "Discount Value Type is required"
      ),
      discount_value: Yup.number()
        .required("Discount Value Type is required")
        .typeError("It has to be a number")
        .when("discount_value_type", {
          is: (val) => val === "PERCENTAGE",
          then: () =>
            Yup.number().max(100, "Nilai diskon tidak boleh lebih dari 100"),
        }),
      start_date: Yup.date()
        .required("Pilih tanggal mulai")
        .min(
          new Date().toISOString().slice(0, 10),
          "Tanggal mulai harus setelah atau sama dengan tanggal hari ini"
        ),
      end_date: Yup.date()
        .required("Pilih tanggal akhir")
        .min(
          Yup.ref("start_date"),
          "Tanggal akhir harus setelah tanggal mulai"
        ),
      voucher_name: Yup.string()
        .required("Voucher Name is required")
        .matches(/^\S+$/, "Only one word is allowed"),
      minimum_amount: Yup.number()
        .required("Voucher Minimum Amount is required")
        .typeError("It has to be a number"),
    });

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isAddOpen}
        onClose={onAddClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Voucher</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                minimum_amount: "",
                discount_value_type: "",
                discount_value: null,
                start_date: "",
                end_date: "",
                voucher_name: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <>
                  <Form>
                    <FormControl>
                      <FormLabel>Voucher Name</FormLabel>
                      <Field as={Input} name="voucher_name" />
                      <ErrorMessage
                        name="voucher_name"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Minimum Total Price</FormLabel>
                      <Field as={Input} name="minimum_amount" />
                      <ErrorMessage
                        name="minimum_amount"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Discount Value Type</FormLabel>
                      <RadioGroup name="discount_value_type">
                        <Field
                          as={Radio}
                          name="discount_value_type"
                          value="PERCENTAGE"
                        >
                          PERCENTAGE
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_value_type"
                          value="NOMINAL"
                        >
                          NOMINAL
                        </Field>
                      </RadioGroup>
                      <ErrorMessage
                        name="discount_value_type"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Voucher Value</FormLabel>
                      <Field as={Input} name="discount_value" />
                      <ErrorMessage
                        name="discount_value"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Field as={Input} type="date" name="start_date" />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <Field as={Input} type="date" name="end_date" />
                      <ErrorMessage
                        name="end_date"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>
                    <ModalFooter>
                      <Button colorScheme="green" mr={3} type="submit">
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={onAddClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                </>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      const data = await getVoucher(adminData.store_id, adminToken);
      console.log(data);
      setDiscounts(data);
    };
    fetchDiscounts();
  }, [adminData.store_id]);

  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-10 my-5">
      <div className="flex justify-end">
        <button
          onClick={onAddOpen}
          className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
        >
          <FaPlus size={15} className="mr-2" /> Add Voucher
        </button>
      </div>
      <TableContainer whiteSpace="normal">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Voucher Name</Th>
              <Th>Minimum Amount</Th>
              <Th>Discount Value</Th>
              <Th>Discount Value Type</Th>
              <Th>Duration</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {discounts.map((discount) => (
              <Tr>
                <Td w="1px">{discount.voucher_id}</Td>
                <Td w="400px">{discount.voucher_name}</Td>
                <Td w="1px">{discount.minimum_amount}</Td>
                <Td w="1px">{discount.voucher_value}</Td>
                <Td w="1px">{discount.voucher_value_type}</Td>
                <Td w="1px">
                  {moment(discount.start_date).format("MMMM DD YYYY")} -{" "}
                  {moment(discount.end_date).format("MMMM DD YYYY")}
                </Td>
                <Td w="1px">
                  <div
                    className="px-7 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => {
                      handleDeleteVoucher(discount.voucher_id);
                    }}
                  >
                    <FaTrash size={15} />
                    <p>Delete</p>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ModalAddDiscount />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          ConfirmDeleteVoucher();
        }}
      />
    </div>
  );
}

export default AdminVoucher;
