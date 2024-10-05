'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
      IremboPay?: any;
    }
  }

const GatewayComponent: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const router = useRouter();

  useEffect(() => {
    if (paymentStatus === 'success') {
      router.push('/payment-success');
    }
  }, [paymentStatus, router]);

  async function createInvoice(amount: number) {
    try {
      const response = await axios.post(
        'https://api.irembopay.com/payments/invoices',
        {
          transactionId: `test01-${Date.now()}`, 
          paymentAccountIdentifier: "PI-c971700700",
          paymentItems: [
            {
              code: "testproduct", 
              quantity: 1,
              unitAmount: amount
            }
          ],
          description: "Payment for service",
          expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Set expiry to 24 hours from now
          language: "EN"
        },
        {
          headers: {
            'irembopay-secretkey': 'sk_live_d93632eb607844b38275de708449b84d',
            'X-API-Version': '2'
          }
        }
      );

      setInvoiceNumber(response.data.data.invoiceNumber);
      return response.data.data.invoiceNumber;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  function makePayment() {
    createInvoice(amount)
      .then((invoiceNumber) => {
        window.IremboPay.initiate({
          publicKey: "pk_live_0dee502dee474af0ba785226b5a21c39",
          invoiceNumber: invoiceNumber,
          locale: window.IremboPay.locale.EN,
          callback: (err: any, resp: any) => {
            if (!err) {
              // Perform actions on success
              console.log('Payment successful', resp);
              setPaymentStatus('success');
              alert('Payment successful!');
              // window.IremboPay.closeModal();
            } else {
              // Perform actions on error
              console.error('Payment failed:', err);
              setPaymentStatus('failed');
              alert('Payment failed. Please try again.');
            }
          }
        });
      })
      .catch((error) => {
        console.error('Failed to create invoice:', error);
        setPaymentStatus('failed');
        alert('Failed to create invoice. Please try again.');
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-600 to-green-400">
      <div className="bg-gray-900 bg-opacity-80 p-8 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-green-500 border-opacity-30 w-96">
        <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">Payment Gateway</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-green-300">Amount</label>
            <input 
              type="number" 
              id="amount"
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-green-500 border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-100 placeholder-green-300 placeholder-opacity-70"
              placeholder="Enter amount"
            />
          </div>
          <button
            onClick={makePayment}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Make Payment
          </button>
          <div>
            <p className="text-sm font-medium text-green-300">Invoice Number: {invoiceNumber}</p>
            <p className="text-sm font-medium text-green-300">Payment Status: {paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatewayComponent;
