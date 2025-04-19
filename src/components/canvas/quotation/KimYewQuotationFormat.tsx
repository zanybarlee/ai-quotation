
import React from "react";
import { QuotationResultType } from "./quotationUtils";

interface KimYewQuotationFormatProps {
  quotation: QuotationResultType;
}

const KimYewQuotationFormat: React.FC<KimYewQuotationFormatProps> = ({ quotation }) => {
  // Calculate GST (9%)
  const gstAmount = quotation.totalCost * 0.09;
  const totalWithGST = quotation.totalCost + gstAmount;
  
  // Format date - using correct month format 'short' instead of 'MMM'
  const formatDate = (date: Date | undefined) => {
    if (!date) return new Date().toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
    return date.toLocaleDateString('en-SG', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  // Convert number to words (simplified version)
  const numberToWords = (num: number) => {
    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);
    
    return `Singapore Dollar ${dollars.toLocaleString('en-SG')} Dollars And ${cents} Cents Only`;
  };

  return (
    <div id="quotation-print-view" className="bg-white p-6 rounded-md shadow-sm border border-gray-200 print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start">
          <div className="mr-4">
            <div className="w-20 h-20 bg-white rounded overflow-hidden">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <polygon points="0,0 60,0 0,60" fill="#d91c27" />
                <polygon points="60,0 120,0 120,60" fill="#0072bb" />
                <polygon points="0,60 60,120 0,120" fill="#d91c27" />
                <polygon points="60,120 120,120 120,60" fill="#0072bb" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-red-600">Kim </span>
              <span className="text-blue-600">Yew </span> 
              <span className="text-gray-700">Integrated Pte. Ltd.</span>
            </h1>
            <p className="text-sm text-gray-600">134 Tagore Lane, Singapore 787557</p>
            <p className="text-sm text-gray-600">Tel: 6466 4211 (7 lines) | Fax: 6235 3639 | Email: kimyewint@kimyew.com.sg</p>
            <p className="text-sm text-gray-600">GST Regn. No: 199606507M | www.kimyew.com.sg</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">QUOTATION</h2>
      </div>

      {/* Customer & Quote Details */}
      <div className="flex justify-between mb-6">
        <div className="w-1/2">
          <p className="font-bold uppercase">{quotation.createdBy || "NATIONAL LIBRARY BOARD"}</p>
          <p>53 Margaret Dr</p>
          <p>Singapore 149297</p>
          <p className="mt-3">Attn: MR.Lim Wei Shyong</p>
          <p>Dear Sir/Madam,</p>
          <p className="mt-3 font-bold underline">{quotation.title}</p>
          <p className="mt-2">We are pleased to quote as follows:</p>
        </div>
        <div className="w-1/2 text-right">
          <div className="flex justify-end mb-1">
            <div className="w-28 font-semibold">Date</div>
            <div className="w-36">: {formatDate(quotation.createdAt)}</div>
          </div>
          <div className="flex justify-end">
            <div className="w-28 font-semibold">Quote. No</div>
            <div className="w-36">: {quotation.id || "Q/NLB/CL-B/535"}</div>
          </div>
        </div>
      </div>

      {/* Quotation Table */}
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-2 py-1 text-center w-12">S/No.</th>
            <th className="border border-gray-300 px-2 py-1 text-center">SOR</th>
            <th className="border border-gray-300 px-2 py-1 text-center">Description</th>
            <th className="border border-gray-300 px-2 py-1 text-center w-16">Unit</th>
            <th className="border border-gray-300 px-2 py-1 text-center w-16">Quantity</th>
            <th className="border border-gray-300 px-2 py-1 text-center w-20">Rate</th>
            <th className="border border-gray-300 px-2 py-1 text-center w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {quotation.lineItems.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-2 py-1">{item.sor || `SME-${index+1}-1-5`}</td>
              <td className="border border-gray-300 px-2 py-1">
                {item.description || item.item}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">{item.unit || "No"}</td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                {item.quantity?.toFixed(2) || "1.00"}
              </td>
              <td className="border border-gray-300 px-2 py-1 text-right">${item.rate.toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1 text-right">${item.cost.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} className="border border-gray-300"></td>
            <td className="border border-gray-300 px-2 py-1 font-semibold">Sub Total SOR</td>
            <td className="border border-gray-300 px-2 py-1 text-right">${quotation.totalCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-gray-300"></td>
            <td className="border border-gray-300 px-2 py-1 font-semibold">Total SOR</td>
            <td className="border border-gray-300 px-2 py-1 text-right">${quotation.totalCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-gray-300"></td>
            <td className="border border-gray-300 px-2 py-1 font-semibold">Add GST 9%</td>
            <td className="border border-gray-300 px-2 py-1 text-right">${gstAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-gray-300"></td>
            <td className="border border-gray-300 px-2 py-1 font-semibold">Total</td>
            <td className="border border-gray-300 px-2 py-1 text-right">${totalWithGST.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Total in words */}
      <p className="mb-8">{numberToWords(totalWithGST)}</p>

      {/* Signatures */}
      <div className="flex justify-between mt-12">
        <div className="w-1/4">
          <p>Yours Faithfully</p>
          <div className="mt-12 border-t border-black w-full"></div>
          <p>Engineer</p>
        </div>
        <div className="w-1/4">
          <p>Checked by:</p>
          <div className="mt-12 border-t border-black w-full"></div>
          <p>Name</p>
          <p>Designation:</p>
          <p>Company Stamp.</p>
        </div>
        <div className="w-1/4">
          <p>Recommended by:</p>
          <div className="mt-12 border-t border-black w-full"></div>
          <p>Name</p>
          <p>Designation:</p>
          <p>Company Stamp.</p>
          <p>Date.</p>
        </div>
      </div>

      <div className="mt-8">
        <p>Approved by:</p>
        <div className="mt-12 border-t border-black w-1/4"></div>
        <p>Name</p>
        <p>Designation:</p>
        <p>Company Stamp.</p>
        <p>Date.</p>
        <p className="mt-2 font-semibold">Remarks:</p>
        <p>a) Price Quoted in Singapore Dollars</p>
      </div>
    </div>
  );
};

export default KimYewQuotationFormat;
