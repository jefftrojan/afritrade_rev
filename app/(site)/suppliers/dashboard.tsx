import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaChartPie, FaBoxOpen, FaDollarSign, FaBars, FaTimes, FaUser, FaBox, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from "groq-sdk";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Product {
  product_name: string;
  location: string;
  supplier_name: string;
  product_details: string;
  image_url: string;
  user_id: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    product_name: '',
    location: '',
    supplier_name: '',
    product_details: '',
    image_url: '',
    user_id: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/products?user_id=${userId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const generateProductDetails = async (productName: string) => {
    const groq = new Groq({ apiKey: "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" });
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate a brief, informative description for a product named "${productName}". Include key features and potential uses.`,
          },
        ],
        model: "mixtral-8x7b-32768",
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating product details:", error);
      return "";
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });

    if (name === "product_name" && value.trim() !== "") {
      const generatedDetails = await generateProductDetails(value);
      setCurrentProduct(prev => ({ ...prev, product_details: generatedDetails }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      let imageUrl = currentProduct.image_url;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadResponse = await axios.post('http://localhost:8000/upload-image', formData);
        imageUrl = uploadResponse.data.image_url;
      }

      const productData = {
        ...currentProduct,
        image_url: imageUrl,
        user_id: userId,
      };

      if (isEditing) {
        await axios.put('http://localhost:8000/products/', productData, {
          params: {
            user_id: userId,
            product_name: currentProduct.product_name
          }
        });
      } else {
        await axios.post('http://localhost:8000/products/', productData);
      }

      fetchProducts();
      setCurrentProduct({
        product_name: '',
        location: '',
        supplier_name: '',
        product_details: '',
        image_url: '',
        user_id: '',
      });
      setSelectedFile(null);
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error adding/updating product:', error.response.data);
        // You can add user-friendly error handling here, e.g., showing an error message
      } else {
        console.error('Error adding/updating product:', error);
      }
    }
  };

  const handleDelete = async (productName: string) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      await axios.delete('http://localhost:8000/products/', {
        params: {
          user_id: userId,
          product_name: productName
        }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const getChartData = () => {
    const categories: { [key: string]: number } = {};
    products.forEach(product => {
      const category = product.product_details.split(',')[0].trim(); // Assuming the first word in product_details is the category
      categories[category] = (categories[category] || 0) + 1;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="bg-green-600 py-4 px-4 shadow-md flex justify-between items-center">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none"
        >
          <FaBars size={24} />
        </button>
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-white"
        >
          Supplier Dashboard
        </motion.h1>
        <div className="w-6"></div> {/* Placeholder for symmetry */}
      </div>

      {/* Hamburger Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 left-0 h-full w-64 bg-green-600 text-white p-4 shadow-lg z-50"
          >
            <div className="flex justify-end">
              <button onClick={toggleMenu} className="text-white">
                <FaTimes size={24} />
              </button>
            </div>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a href="./profile" className="flex items-center text-lg hover:text-green-200 transition duration-300">
                    <FaUser className="mr-2" /> Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-lg hover:text-green-200 transition duration-300">
                    <FaBox className="mr-2" /> Items
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-lg hover:text-green-200 transition duration-300">
                    <FaChartPie className="mr-2" /> Orders
                  </a>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center text-lg hover:text-green-200 transition duration-300">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
          >
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
              <FaChartPie className="mr-2" /> Product Distribution
            </h2>
            <div className="w-full h-64">
              <Pie data={getChartData()} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-2 border-l-4 border-green-500"
          >
            <h2 className="text-xl font-semibold mb-4 text-green-700">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-700 flex items-center">
                  <FaBoxOpen className="mr-2" /> {products.length}
                </p>
                <p className="text-sm text-green-600 mt-1">Total Products</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-700 flex items-center">
                  <FaDollarSign className="mr-2" /> 10,000
                </p>
                <p className="text-sm text-green-600 mt-1">Total Revenue</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-green-500"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-green-700">Your Products</h2>
            <button
              onClick={() => {
                setCurrentProduct({
                  product_name: '',
                  location: '',
                  supplier_name: '',
                  product_details: '',
                  image_url: '',
                  user_id: '',
                });
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:bg-green-600 transition duration-300 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Product
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div 
                key={product.product_name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-green-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="h-2 bg-green-500"></div>
                <img src={product.image_url} alt={product.product_name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">{product.product_name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.product_details}</p>
                  <p className="text-xs text-gray-500">Location: {product.location}</p>
                  <p className="text-xs text-gray-500">Supplier: {product.supplier_name}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-green-500 hover:text-green-600 transition duration-300"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_name)}
                      className="text-red-500 hover:text-red-600 transition duration-300"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-green-700">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="product_name"
                value={currentProduct.product_name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="location"
                value={currentProduct.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                name="supplier_name"
                value={currentProduct.supplier_name}
                onChange={handleInputChange}
                placeholder="Supplier Name"
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                name="product_details"
                value={currentProduct.product_details}
                onChange={handleInputChange}
                placeholder="Product Details (AI-generated based on product name)"
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition duration-300"
                >
                  {isEditing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;