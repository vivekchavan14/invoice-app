import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useInvoiceListData, useProductList } from "../redux/hooks";
import ProductCard from "./ProductCard";
import { BsEyeFill, BsTrash } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { deleteProduct } from "../redux/productSlice";
import { updateWholeInvoice } from "../redux/invoicesSlice";

const ProductList = () => {
  const { productList } = useProductList();
  const { invoiceList } = useInvoiceListData();
  const dispatch = useDispatch();

  const isProductListEmpty = productList.length === 0;

  const deleteProductInInvoiceList = (productId) => {
    const updatedInvoiceList = invoiceList.map((invoice) => {
      const updatedItems = invoice.items.filter(
        (item) => String(item.itemId) !== String(productId)
      );
      const updatedTotal = calculateTotal(updatedItems);
      return {
        ...invoice,
        items: updatedItems,
        total: updatedTotal,
      };
    });

    return updatedInvoiceList;
  };

  const calculateTotal = (items) => {
    let total = items.reduce(
      (accumulator, item) => accumulator + item.itemPrice * item.itemQuantity,
      0
    );
    return total.toFixed(2);
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
    const updatedInvoiceList = deleteProductInInvoiceList(productId);
    dispatch(updateWholeInvoice(updatedInvoiceList));
    alert("Product deleted Successfully");
  };

  return (
    <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
      <h3 className="fw-bold pb-0 pb-md-0 text-center">Product Tab</h3>
      {isProductListEmpty ? <hr /> : null}

      {!isProductListEmpty && (
        <div style={{ width: "100%" }}>
          <Table responsive className=" mt-2 justify-content-between text-center">
            <thead>
              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <ProductRow key={product.id} product={product} onDelete={handleDelete} />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {isProductListEmpty ? (
        <div className="d-flex flex-column align-items-center">
          <h3 className="fw-bold pb-2 pb-md-4">No product added</h3>
          <ProductCard usage="create">Add Product</ProductCard>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <ProductCard usage="create">Add Product</ProductCard>
        </div>
      )}
    </Card>
  );
};

const ProductRow = ({ product, onDelete }) => {
  return (
    <tr className=" text-center">
      <td className=" text-center">{product.id}</td>
      <td className=" text-center">{product.productName}</td>
      <td>
        <div className="d-flex gap-2 justify-content-center">
          <ProductCard usage="edit" id={product.id} btnType="outline-primary">
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BiSolidPencil />
            </div>
          </ProductCard>
          <ProductCard usage="view" id={product.id} btnType="secondary">
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BsEyeFill />
            </div>
          </ProductCard>
          <Button
            variant="danger"
            type="button"
            onClick={() => onDelete(product.id)}
          >
            <div className="d-flex align-items-center justify-content-center gap-0">
              <BsTrash />
            </div>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProductList;
