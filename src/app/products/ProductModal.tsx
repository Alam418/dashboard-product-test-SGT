"use client";
import { Modal, Form, Input, InputNumber } from "antd";
import { useEffect } from "react";

export interface Product {
  product_id?: string;
  product_title: string;
  product_price: number;
  product_category: string;
  product_description: string;
  product_image: string;
}

interface ProductFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Product) => void;
  initialData?: Product | null;
}

export default function ProductFormModal({
  open,
  onCancel,
  onSubmit,
  initialData,
}: ProductFormModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialData || {
          product_title: "",
          product_price: 0,
          product_category: "",
          product_description: "",
          product_image: "",
        }
      );
    } else {
      form.resetFields();
    }
  }, [open, form, initialData]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({ ...initialData, ...values });
      })
      .catch((err) => console.log("Validation failed", err));
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
      onCancel={onCancel}
      onOk={handleOk}
      okText={isEdit ? "Update" : "Create"}
    >
      {open && (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="product_title"
            rules={[{ required: true, message: "Please input title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="product_price"
            rules={[{ required: true, message: "Please input price" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="product_category"
            rules={[{ required: true, message: "Please input category" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="product_description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="product_image"
            rules={[
              { required: true, message: "Please input image URL" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
