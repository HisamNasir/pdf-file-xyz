import React, { useState, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import Draggable from 'react-draggable';
import jsPDF from 'jspdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ pdfFile }) => {
  const [signatureImage, setSignatureImage] = useState(null);
  const signatureRef = useRef();
  const draggableRef = useRef(null);

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const saveSignature = () => {
    const signatureDataUrl = signatureRef.current.toDataURL();
    setSignatureImage(signatureDataUrl);
  
    // Check if draggableRef.current is not null before accessing its properties
    if (draggableRef.current) {
      draggableRef.current.style.display = 'block';
    }
  };
  
  const attachSignatureToPDF = () => {
    if (!signatureImage) {
      alert('Please add a signature before attaching to PDF.');
      return;
    }
  
    const pdf = new jsPDF();
  
    // Assuming the original PDF is one page
    const pdfWidth = 210;
    const pdfHeight = 297;
  
    // Add the original PDF content
    pdf.addImage(pdfFile, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  
    // Calculate the position of the signature based on the draggable window position
    const draggableRect = draggableRef.current.getBoundingClientRect();
    const pdfRect = document.querySelector('.rpv-core__viewer').getBoundingClientRect();
  
    const posX = (draggableRect.left - pdfRect.left) * (pdfWidth / pdfRect.width);
    const posY = (draggableRect.top - pdfRect.top) * (pdfHeight / pdfRect.height);
  
    // Add the signature to the same page
    pdf.addImage(signatureImage, 'PNG', posX, posY, 50, 25);
  
    // Save or display the new PDF
    pdf.save('signed_document.pdf');
  };
  

  const handleDragStop = () => {
    // You can handle any additional actions when the draggable window stops being dragged
  };
  const downloadOriginalPDF = () => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = 'xyz.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer fileUrl={pdfFile} />
      </Worker>

      {/* Signature Canvas */}
      <div className=" bottom-0 left-0 p-4">
        <SignatureCanvas ref={signatureRef} canvasProps={{ width: 400, height: 200, className: 'border' }} />
        <div className="mt-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clearSignature}>
            Clear Signature
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={saveSignature}>
            Save Signature
          </button>
          <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={attachSignatureToPDF}
        >
          Attach to PDF
        </button>
        </div>
      </div>

      {/* Draggable Signature Window */}
{/* Draggable Signature Window */}
{signatureImage && (
  <Draggable onStop={handleDragStop}>
    <div
      ref={draggableRef}
      className="w-32 h-32 bottom-4 right-4 bg-white p-4 rounded border shadow-md"
    >
      <img src={signatureImage} alt="Signature" className="w-32 h-16" />
    </div>
  </Draggable>
)}


      {/* Attach to PDF button */}
      <div className="">

      </div>
    </div>
  );
};

export default PDFViewer;
