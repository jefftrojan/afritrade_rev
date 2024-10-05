"use client";

import { useState } from "react";
import Navbar from "@/components/general/header/menu";
import Image from "next/image";
import Hero from "@/public/intraAfrica.webp";
import { FaRobot, FaChartLine, FaHandshake, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Scale, Search, Globe, CreditCard, Map } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div 
      className="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-10 transition-all duration-300 border border-gray-200 border-opacity-20"
      whileHover={{ y: -5 }}
    >
      <div className="text-white mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-800">{description}</p>
    </motion.div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("");
  const [hoverState, setHoverState] = useState({
    title: false,
    button: false,
  });

  const features = [
    { title: "Legal Compliance", description: "Use our AI-powered platform to navigate complex trade regulations with ease.", icon: <Scale size={24} /> },
    { title: "Supplier Discovery", description: "Connect with local suppliers and expand your network.", icon: <Search size={24} /> },
    { title: "Transport Coordination", description: "Efficiently manage deliveries with AI-recommended routes.", icon: <Map size={24} /> },
  ];

  return (
    <>
    <div className="sticky top-0 z-50 fixed">
      <Navbar />
    </div>
    <div className="overflow-x-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between mb-32">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:px-12">
            <h1 className="text-2xl lg:text-8xl font-extrabold text-green-800 mb-8 leading-tight">
              Growing <span className="text-green-600 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-500">African Trade</span>
            </h1>
            <p className="text-xl text-gray-700 mb-12">
              Harness the power of AI to connect, trade, and grow within Africa's Free Trade Zone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="/auth"
                className="bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full transition duration-300 text-center shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
              >
                Get Started <FaArrowRight className="ml-2" />
              </a>
              <a
                href="/auth"
                className="bg-white hover:bg-gray-100 text-green-600 font-bold py-4 px-8 rounded-full border-2 border-green-600 transition duration-300 text-center shadow-lg hover:shadow-xl text-lg"
              >
                Login
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative">
              <Image
                src={Hero.src}
                alt="AfriTrade Illustration"
                width={700}
                height={500}
                className="rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl">
                <p className="text-green-600 font-bold text-2xl"></p>
                <p className="text-gray-600">connecting businesses</p>
              </div>
              <div className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-xl">
                <p className="text-blue-600 font-bold text-2xl"></p>
                <p className="text-gray-600">For East African Countries</p>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
      <section className="py-20 px-8 bg-green-800 bg-opacity-50 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Empowering African Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AfriTrade Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center text-green-800">
          <h2 className="text-3xl font-bold mb-6">Why AfriTrade?</h2>
          <p className="text-lg mb-8">
            AfriTrade aims to increase intra-African trade from its current 15% to 40-45% in the coming years. 
            By leveraging AI, we're making it easier for businesses to connect, comply with regulations, and 
            optimize their operations within the African Free Trade Zone.
          </p>
          
        </div>
      </section>

       
      </main>
    </div>
    </>
  );
}
