
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/PaymentSuccessful.scss';

const PaymentSuccessful = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(30);
  
  // Validate and extract state data safely
  const transactionData = (() => {
    const state = location.state || {};
    const requiredKeys = ['transactionType', 'amount', 'updatedBalance'];
    
    if (!requiredKeys.every(key => key in state)) {
      return null;
    }
    
    return {
      transactionType: state.transactionType,
      amount: state.amount,
      updatedBalance: state.updatedBalance
    };
  })();

  // Redirect if no valid data
  useEffect(() => {
    if (!transactionData) {
      navigate("/cashier-app", { replace: true });
    }
    
    return () => {
      window.history.replaceState({}, document.title);
    };
  }, [navigate, transactionData]);

  // Countdown timer effect
  useEffect(() => {
    if (!transactionData) return;

    const countdown = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(countdown);
  }, [transactionData]);

  // Handle auto-redirect
  useEffect(() => {
    if (timer === 0) {
      navigate("/cashier-app", { replace: true });
    }
  }, [timer, navigate]);

  if (!transactionData) return null;


  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const printWindow = window.open('', '', 'height=600,width=800');
    
    // Write the print content with proper styling
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .receipt-header h2 {
              color: #333;
              margin-bottom: 10px;
            }
            .receipt-content {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .receipt-row:last-child {
              border-bottom: none;
            }
            .receipt-label {
              font-weight: bold;
              color: #555;
            }
            .receipt-value {
              color: #333;
            }
            .receipt-footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            .timestamp {
              margin-top: 20px;
              text-align: right;
              font-size: 12px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <h2>Transaction Receipt</h2>
            <p>Thank you for your transaction</p>
          </div>
          <div class="receipt-content">
            <div class="receipt-row">
              <span class="receipt-label">Transaction Type:</span>
              <span class="receipt-value">${transactionType}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Amount:</span>
              <span class="receipt-value">₹${amount}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Updated Balance:</span>
              <span class="receipt-value">₹${updatedBalance}</span>
            </div>
          </div>
          <div class="receipt-footer">
            <p>Keep this receipt for your records</p>
          </div>
          <div class="timestamp">
            ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="payment-successful-container">
      <div className="receipt-card">
        <div id="print-content" className="receipt-content">
          <div className="receipt-header">
            <h2>Payment Successful</h2>
          </div>
          <div className="receipt-details">
            <div className="receipt-row">
              <span className="receipt-label">Transaction Type:</span>
              <span className="receipt-value">{transactionData.transactionType}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount:</span>
              <span className="receipt-value">₹{transactionData.amount}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Updated Balance:</span>
              <span className="receipt-value">₹{transactionData.updatedBalance}</span>
            </div>
          </div>
        </div>
        <div className="countdown-banner">
          Auto-redirecting in {timer} seconds...
        </div>
        <div className="button-group">
          <button onClick={handlePrint} className="print-button">
            Print Transaction Details
          </button>
          <button onClick={() => navigate("/cashier-app")} className="back-button">
            Back to Cashier App
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;

