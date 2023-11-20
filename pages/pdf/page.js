import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/pdfjs';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {selectedFile && (
        <div style={{ marginTop: '20px' }}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${window.pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={URL.createObjectURL(selectedFile)} />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
