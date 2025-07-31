"use client";
import axios from "axios";
import { Table, Button, Select, Modal, message, Input } from "antd";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

import ProductFormModal from "./ProductModal";

interface Product {
  product_id?: string;
  product_title: string;
  product_price: number;
  product_category: string;
  product_description: string;
  product_image: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const { Option } = Select;

  const fetchProducts = (
    page: number,
    pageSize: number,
    search: string = ""
  ) => {
    setLoading(true);
    axios
      .get("/api/products", {
        params: { page, limit: pageSize, search},
      })
      .then((res) => {
        setProducts(res.data.data);
        setPagination({
          total: res.data.pagination.total,
          current: res.data.pagination.page,
          pageSize: res.data.pagination.limit,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values: any) => {
    const apiCall = editingProduct
      ? axios.put("/api/product", { ...editingProduct, ...values })
      : axios.post("/api/product", values);

    apiCall
      .then(() => {
        fetchProducts(pagination.current, pagination.pageSize);
        setModalOpen(false);
      })
      .catch((err) => console.error("Submit failed", err));
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`/api/product?id=${id}`);
          message.success("Product deleted");
          fetchProducts(pagination.current, pagination.pageSize);
        } catch (error) {
          console.error("Delete failed", error);
          message.error("Failed to delete product");
        }
      },
    });
  };

  const handleTableChange = (newPagination: any) => {
    const { current, pageSize } = newPagination;
    setPagination({ ...pagination, current, pageSize });
    fetchProducts(current, pageSize, searchQuery);
  };

  const debouncedSearch = debounce((value: string) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchQuery(value);
    fetchProducts(1, pagination.pageSize, value);
  }, 300);

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize, searchQuery);
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "product_title",
      width: 200,
    },
    {
      title: "Price",
      dataIndex: "product_price",
      render: (price: number) => `Rp ${price.toLocaleString("id-ID")}000`,
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "product_description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Image",
      dataIndex: "product_image",
      width: 100,
      render: (src: string) => (
        <img
          alt="Product"
          src={src}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/100x100?text=No+Image";
          }}
        />
      ),
    },
    {
      title: "Actions",
      width: 140,
      render: (_: any, record: Product) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => {
              setEditingProduct(record);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.product_id!)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-green-700">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
          >
            + Add Product
          </Button>
          <Input.Search
            placeholder="Search products..."
            allowClear
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ width: 200 }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white">Items per page:</span>
          <Select
            value={pagination.pageSize}
            onChange={(newLimit) => {
              setPagination((prev) => ({
                ...prev,
                pageSize: newLimit,
                current: 1,
              }));
              fetchProducts(1, newLimit, searchQuery);
            }}
            style={{ width: 100 }}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="product_id"
        loading={loading}
        scroll={{ x: 900 }}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{ emptyText: "No products found" }}
      />

      <ProductFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
      />
    </div>
  );
}
