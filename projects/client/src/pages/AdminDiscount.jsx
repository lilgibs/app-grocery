import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
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
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  addDiscount,
  deleteDiscount,
  editDiscount,
  getDiscounts,
} from "../api/discountApi";
import { getDiscount } from "../features/discountSlice";
import { fetchProducts } from "../api/userApi";
import { addVoucher } from "../api/voucherApi";

function AdminDiscount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminData = useSelector((state) => state.admin.admin);
  const storeDiscounts = useSelector((state) => state.discount.discount);
  const adminToken = localStorage.getItem("admin_token");
  const [discounts, setDiscounts] = useState(storeDiscounts);
  const [selectedDiscount, setselectedDiscount] = useState(null);
  const [products, setProducts] = useState([]);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const initialRef = useRef();

  const handleEditDiscount = (discount) => {
    setselectedDiscount(discount);
    onEditOpen();
  };

  const renderDiscounts = () => {
    return discounts.map((discount) => (
      <div
        key={discount.discount_id}
        className="w-full  p-2 border border-pink-500 rounded-md  shadow-md"
      >
        <div className="flex">
          <div className="flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2 gap-2 px-1">
            <div>
              <p className="text-lg font-semibold text-pink-500 ">Discount:</p>
              <p
                className={
                  discount.discount_type === "BUY_1_GET_1"
                    ? "hidden"
                    : "text-md font-medium"
                }
              >
                {discount.discount_value_type === "PERCENTAGE"
                  ? `${discount.discount_value} %`
                  : `Rp ${discount.discount_value}`}
              </p>
              <p>{discount.discount_type}</p>
              <p>
                {moment(discount.start_date).format("DD MMMM YYYY")} -
                {moment(discount.end_date).format("DD MMMM YYYY")}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1 items-center w-1/2 border-l-2">
            <div
              className="px-2 py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => handleEditDiscount(discount)}
            >
              <FaPen size={15} />
              <p>Edit</p>
            </div>
            <div
              className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={async () => {
                await deleteDiscount(discount.discount_id, adminToken);
                dispatch(getDiscount(adminData.store_id, adminToken));
              }}
            >
              <FaTrash size={15} />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const ModalAddDiscount = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      const data = {
        discount_type: values.discount_type,
        discount_value_type: values.discount_value_type,
        discount_value: values.discount_value,
        start_date: values.start_date,
        end_date: values.end_date,
        store_id: adminData.store_id,
        products: values.products,
        minimum_amount: values.minimum_amount,
        voucher_name: values.voucher_name,
      };

      if (data.discount_type === "VOUCHER") {
        await addVoucher(data, adminToken);
      } else {
        await addDiscount(data, adminToken);
      }

      onAddClose();
      dispatch(getDiscount(adminData.store_id, adminToken));
      resetForm();
      setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
      discount_type: Yup.string().required("Pilih tipe diskon"),
      discount_value_type: Yup.string().when("discount_type", {
        is: (val) => val !== "BUY_1_GET_1",
        then: () => Yup.string().required("Discount Value Type is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      discount_value: Yup.number()
        .required("Isi nilai diskon")
        .typeError("Diskon harus berupa angka")
        .when("discount_type", {
          is: (val) => val !== "BUY_1_GET_1",
          then: () => Yup.string().required("Discount Value Type is required"),
          otherwise: () => Yup.string().nullable(),
        })
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
      products: Yup.array().when("discount_type", {
        is: (val) => val !== "VOUCHER",
        then: () => Yup.array().min(1, "Discount Value Type is required"),
        otherwise: () => Yup.array().nullable(),
      }),
      voucher_name: Yup.string().when("discount_type", {
        is: (val) => val === "VOUCHER",
        then: () =>
          Yup.string()
            .required("Voucher Name is required")
            .matches(/^\S+$/, "Only one word is allowed"),
        otherwise: () => Yup.string().nullable(),
      }),
      minimum_amount: Yup.number().when("discount_type", {
        is: (val) => val === "VOUCHER",
        then: () =>
          Yup.number()
            .required("Voucher Minimum Amount is required")
            .typeError("It has to be a number"),
        otherwise: () => Yup.number().nullable(),
      }),
    });

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isAddOpen}
        onClose={onAddClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Discount</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                discount_type: "",
                minimum_amount: "",
                discount_value_type: "",
                discount_value: null,
                start_date: "",
                end_date: "",
                products: [],
                voucher_name: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <>
                  {console.log(values)}
                  <Form>
                    <FormControl>
                      <FormLabel>Discount Type</FormLabel>
                      <RadioGroup name="discount_type">
                        <Field as={Radio} name="discount_type" value="LANGSUNG">
                          LANGSUNG
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_type"
                          value="BUY_1_GET_1"
                        >
                          BUY 1 GET 1
                        </Field>
                        <Field as={Radio} name="discount_type" value="VOUCHER">
                          VOUCHER
                        </Field>
                      </RadioGroup>
                      <ErrorMessage
                        name="discount_type"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.discount_type === "VOUCHER" ? null : "hidden"
                      }
                    >
                      <FormLabel>Voucher Name</FormLabel>
                      <Field as={Input} name="voucher_name" />
                      <ErrorMessage
                        name="voucher_name"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.discount_type === "VOUCHER" ? null : "hidden"
                      }
                    >
                      <FormLabel>Minimum Total Price</FormLabel>
                      <Field as={Input} name="minimum_amount" />
                      <ErrorMessage
                        name="minimum_amount"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.discount_type === "BUY_1_GET_1" ? "hidden" : null
                      }
                    >
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

                    <FormControl
                      className={
                        values.discount_type === "BUY_1_GET_1" ? "hidden" : null
                      }
                    >
                      <FormLabel>Discount Value</FormLabel>
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
                    <FormControl
                      className={
                        values.discount_type === "VOUCHER" ? "hidden" : null
                      }
                    >
                      <FormLabel>Products</FormLabel>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-1">
                          {products.map((product) => (
                            <div key={product.product_id}>
                              <label>
                                <Field
                                  type="checkbox"
                                  name="products"
                                  value={product.product_name}
                                />
                                {product.product_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ErrorMessage
                        name="products"
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

  const ModalEditDiscount = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      const data = {
        discount_type: values.discount_type,
        discount_value_type: values.discount_value_type,
        discount_value: values.discount_value,
        start_date: values.start_date,
        end_date: values.end_date,
      };

      await editDiscount(selectedDiscount.discount_id, data, adminToken);
      onEditClose();
      dispatch(getDiscount(adminData.store_id, adminToken));
      resetForm();
      setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
      discount_type: Yup.string().required("Pilih tipe diskon"),
      discount_value_type: Yup.string().required("Pilih tipe nilai diskon"),
      discount_value: Yup.number()
        .required("Isi nilai diskon")
        .typeError("Diskon harus berupa angka"),
      // .when("discount_value_type", {
      //   is: "PERCENTAGE",
      //   then: Yup.number().max(
      //     100,
      //     "Nilai diskon tidak boleh lebih dari 100"
      //   ),
      // }),
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
    });

    const [isBuyOneGetOne, setIsBuyOneGetOne] = useState(false);
    const [inputs, setInputs] = useState([""]);
    const handleAddInput = () => {
      setInputs([...inputs, ""]);
    };

    const handleRemoveInput = (index) => {
      const newInputs = [...inputs];
      newInputs.splice(index, 1);
      setInputs(newInputs);
    };

    const handleChangeInput = (value, index) => {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
    };

    const handleSubmit1 = () => {
      console.log(inputs);
    };

    const handleDiscountTypeChange = (value) => {
      setIsBuyOneGetOne(value === "BUY_1_GET_1");
      console.log(isBuyOneGetOne);
    };

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Discount</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                discount_type: selectedDiscount
                  ? selectedDiscount.discount_type
                  : "",
                minimum_amount: selectedDiscount
                  ? selectedDiscount.minimum_amount
                  : "",
                discount_value_type: selectedDiscount
                  ? selectedDiscount.discount_value_type
                  : "",
                discount_value: selectedDiscount
                  ? selectedDiscount.discount_value
                  : "",
                start_date: selectedDiscount ? selectedDiscount.start_date : "",
                end_date: selectedDiscount ? selectedDiscount.end_date : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(values) => (
                <>
                  {console.log(values.values)}
                  <Form>
                    <FormControl>
                      <FormLabel>Discount Type</FormLabel>
                      <RadioGroup name="discount_type">
                        <Field
                          as={Radio}
                          name="discount_type"
                          value="LANGSUNG"
                          initialChecked="true"
                        >
                          LANGSUNG
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_type"
                          value="BUY_1_GET_1"
                          //   checked={field.value === "LANGSUNG"}
                        >
                          BUY 1 GET 1
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_type"
                          value="VOUCHER"
                          //   checked={field.value === "LANGSUNG"}
                        >
                          VOUCHER
                        </Field>
                      </RadioGroup>
                      <ErrorMessage
                        name="discount_type"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.values.discount_type === "VOUCHER"
                          ? null
                          : "hidden"
                      }
                    >
                      <FormLabel>Minimum Total Price</FormLabel>
                      <Field as={Input} name="minimum_amount" />
                      <ErrorMessage
                        name="minimum_amount"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.values.discount_type === "BUY_1_GET_1"
                          ? "hidden"
                          : null
                      }
                    >
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

                    <FormControl
                      className={
                        values.values.discount_type === "BUY_1_GET_1"
                          ? "hidden"
                          : null
                      }
                    >
                      <FormLabel>Discount Value</FormLabel>
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
                      <Button colorScheme="red" onClick={onEditClose}>
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
      const data = await getDiscounts(adminData.store_id, adminToken);
      const mergedData = Object.values(
        data.reduce((acc, obj) => {
          if (!acc[obj.discount_id]) {
            acc[obj.discount_id] = { ...obj };
          } else {
            acc[obj.discount_id].product_name += `, ${obj.product_name}`;
          }
          return acc;
        }, {})
      );
      console.log(mergedData);
      setDiscounts(mergedData);
    };
    fetchDiscounts();
  }, [adminData.store_id]);

  useEffect(() => {
    const getProducts = async () => {
      const result = await fetchProducts(adminData.store_id);
      setProducts(result.products);
    };
    getProducts();
  }, [adminData.store_id]);

  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-10">
      <h1
        className="text-4xl pt-5 font-semibold tracking-tight text-pink-500 cursor-pointer"
        onClick={() => navigate("/admin/discounts")}
      >
        Promo Management
      </h1>
      <TableContainer whiteSpace="normal">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Product Name</Th>
              <Th>Discount Value</Th>
              <Th>Discount Type</Th>
              <Th>Discount Value Type</Th>
              <Th>Duration</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {discounts.map((discount) => (
              <Tr>
                <Td w="1px">{discount.discount_id}</Td>
                <Td w="400px">{discount.product_name}</Td>
                <Td w="1px">{discount.discount_value}</Td>
                <Td w="1px">{discount.discount_type}</Td>
                <Td w="1px">{discount.discount_value_type}</Td>
                <Td w="1px">
                  {moment(discount.start_date).format("MMMM DD YYYY")} -{" "}
                  {moment(discount.end_date).format("MMMM DD YYYY")}
                </Td>
                <Td w="1px">
                  <button>oke</button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
    // <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto my-5">
    //   <div className="px-8 py-4 bg-white border shadow-md rounded">
    //     <div className="w-full bg-slate-100 text-center py-4 rounded-md mb-8">
    //       <p className="font-semibold text-pink-500 text-lg">
    //         Discount Management
    //       </p>
    //     </div>
    //     <div className="flex justify-end">
    //       <button
    //         onClick={onAddOpen}
    //         className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
    //       >
    //         <FaPlus size={15} className="mr-2" /> Add Discount
    //       </button>
    //     </div>
    //     <div className="flex flex-wrap justify-center gap-4">
    //       {/* {renderDiscounts()} */}
    //       <TableContainer variant="striped" colorScheme="blue">
    //         <Table variant="striped" colorScheme="blue">
    //           <Thead>
    //             <Tr>
    //               <Th>Product Name</Th>
    //               <Th>Quantity</Th>
    //               <Th>Type</Th>
    //               <Th>Date</Th>
    //             </Tr>
    //           </Thead>
    //           <Tbody>
    //             {discounts.map((discount) => (
    //               <Tr>
    //                 <Td>{discount.product_name}</Td>
    //                 <Td>{discount.quantity_change}</Td>
    //                 <Td>{discount.change_type}</Td>
    //                 <Td>
    //                   {moment(discount.change_date).format("MMMM DD YYYY")}
    //                 </Td>
    //               </Tr>
    //             ))}
    //           </Tbody>
    //         </Table>
    //       </TableContainer>
    //       <ModalAddDiscount />
    //       <ModalEditDiscount />
    //     </div>
    //   </div>
    // </div>
  );
}

export default AdminDiscount;
