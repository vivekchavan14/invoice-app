import React, { useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import generateRandomId from "../utils/generateRandomId";
import { useInvoiceListData, useProductList } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { addProduct, editProduct } from "../redux/productSlice";
import { updateWholeInvoice } from "../redux/invoicesSlice";

const ProductCard = (props) => {
  const [show, setShow] = useState(false);
  const { getOneProduct } = useProductList();
  const dispatch = useDispatch();
  const { invoiceList } = useInvoiceListData();
  const isEdit = (props?.usage === "edit" || props?.usage==="view") ? true : false;

  const [productData, setproductData] = useState(
    isEdit
      ? getOneProduct(props?.id)
      : {
          productName: "",
          productDescription: "",
          productPrice: 0,
        }
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function updateProductInInvoiceList(
    invoiceList,
    productId,
    updatedProductDetails
  ) {
 
    const updatedInvoiceList = invoiceList.map((invoice) => ({
      ...invoice,
      items: [...invoice.items],
    }));

    for (let i = 0; i < updatedInvoiceList.length; i++) {
      let invoice = updatedInvoiceList[i];

    
      let itemIndex = invoice.items.findIndex(
        (item) => String(item.itemId) === String(productId)
      );

      if (itemIndex !== -1) {
      
        const updatedItem = {
          ...invoice.items[itemIndex],
          ...updatedProductDetails,
        };

       
        invoice.items = [
          ...invoice.items.slice(0, itemIndex),
          updatedItem,
          ...invoice.items.slice(itemIndex + 1),
        ];

        invoice.total = calculateTotal(invoice.items);
      }
    }
    return updatedInvoiceList;
  }

  function calculateTotal(items) {
    let total = items.reduce(
      (accumulator, item) => accumulator + item.itemPrice * item.itemQuantity,
      0
    );


    return total.toFixed(2); 
  }

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(editProduct({ id: props?.id, updateProduct: productData }));
      // update the item containing this product
      const updatedItem = {
        itemId: props.id,
        itemName: productData.productName,
        itemDescription: productData.productDescription,
        itemPrice: productData.productPrice,
      };
      const updatedInovoiceList = updateProductInInvoiceList(
        invoiceList,
        props?.id,
        updatedItem
      );

      dispatch(updateWholeInvoice(updatedInovoiceList));
      alert("Product Updated Successfully");
    } else {
      dispatch(addProduct({ id: generateRandomId(), ...productData }));
      setproductData({
        productName: "",
        productDescription: "",
        productPrice: 0,
      });
      alert("Product Added Successfully");
    }
  };
  return (
    <>
      <Button
        variant={props.btnType ? props.btnType : "primary"}
        onClick={handleShow}
      >
        {/* {isEdit ? "Edit Product" : "Add Product"} */}
        {props?.children}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Control
              type="text"
              value={productData?.productName}
              placeholder="Product Name"
              onChange={(e) => {
                setproductData((prev) => {
                  return { ...prev, productName: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
            <Form.Control
              type="text"
              value={productData?.productDescription}
              placeholder="Product Description"
              onChange={(e) => {
                setproductData((prev) => {
                  return { ...prev, productDescription: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
            <Form.Control
              type="number"
              value={productData?.productPrice}
              placeholder="Product Price"
              onChange={(e) => {
                setproductData((prev) => {
                  return { ...prev, productPrice: e.target.value };
                });
              }}
              className=" my-2"
              disabled = {props.usage ==="view" ? true:false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {props?.usage === "view" ? null : (
            <Button
              variant="primary"
              onClick={() => {
                handleClose();
                handleSubmit();
              }}
            >
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;
