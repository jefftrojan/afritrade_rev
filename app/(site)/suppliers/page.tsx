"use client"
import React, { useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string; // Added description field
  image: File | null; // Added image field
}

interface Order {
  id: number;
  product: string;
  quantity: number;
  buyer: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Shipped';
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-green-800 shadow-lg rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, variant = 'default', type = 'button' }) => (
  <button
    onClick={onClick}
    type={type}
    className={`px-4 py-2 rounded-md transition duration-300 ease-in-out transform ${
      variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'bg-green-600 text-white hover:bg-green-700'
    } ${className}`}
  >
    {children}
  </button>
);

interface InputProps {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ name, type = 'text', placeholder, required }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    required={required}
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
);

const TextArea: React.FC<InputProps> = ({ name, placeholder, required }) => (
  <textarea
    name={name}
    placeholder={placeholder}
    required={required}
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-100 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-green-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SupplierDashboard: React.FC = () => {
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Product A', price: 100, quantity: 50, description: 'Description A', image: null },
    { id: 2, name: 'Product B', price: 150, quantity: 30, description: 'Description B', image: null },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, product: 'Product A', quantity: 5, buyer: 'Buyer 1', status: 'Pending' },
    { id: 2, product: 'Product B', quantity: 3, buyer: 'Buyer 2', status: 'Shipped' },
  ]);

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProduct: Product = {
      id: products.length + 1,
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      quantity: parseInt(formData.get('quantity') as string, 10),
      description: formData.get('description') as string, // Get description
      image: formData.get('image') as File | null, // Get image
    };
    setProducts([...products, newProduct]);
    setShowAddProductModal(false);
  };

  const handleConfirmOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Confirmed' } : order
    ));
  };

  const handleRejectOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Rejected' } : order
    ));
  };

  return (
    <div className="container mx-auto p-4 bg-green-50">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Supplier Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <h3 className="text-sm font-medium mb-2 text-white">Total Products</h3>
          <p className="text-2xl font-bold text-white">{products.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-2 text-white">Total Sales</h3>
          <p className="text-2xl font-bold text-white">$10,234</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-2 text-white">Pending Orders</h3>
          <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'Pending').length}</p>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-800">Products</h2>
        <Button onClick={() => setShowAddProductModal(true)}>
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {products.map(product => (
          <Card key={product.id}>
            <h3 className="font-bold mb-2 text-white">{product.name}</h3>
            <p className="text-white">Price: ${product.price}</p>
            <p className="text-white">Quantity: {product.quantity}</p>
            <p className="text-white">Description: {product.description}</p>
            {product.image && <img src={URL.createObjectURL(product.image)} alt={product.name} className="mt-2 w-full h-auto" />} {/* Display image */}
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-green-800">Orders</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id}>
            <h3 className="font-bold mb-2 text-white">{order.product}</h3>
            <p className="text-white">Quantity: {order.quantity}</p>
            <p className="text-white">Buyer: {order.buyer}</p>
            <p className="text-white">Status: {order.status}</p>
            {order.status === 'Pending' && (
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => handleConfirmOrder(order.id)}>Confirm</Button>
                <Button variant="destructive" onClick={() => handleRejectOrder(order.id)}>Reject</Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Add New Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input name="name" placeholder="Product Name" required />
          <Input name="price" type="number" placeholder="Price" required />
          <Input name="quantity" type="number" placeholder="Quantity" required />
          <TextArea name="description" placeholder="Product Description" required /> {/* Added description input */}
          <Input name="image" type="file" placeholder="Upload Image" required /> {/* Added image upload */}
          <Button type="submit">Add Product</Button>
        </form>
      </Modal>
    </div>
  );
};

export default SupplierDashboard;