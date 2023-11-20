import React, { useState } from 'react';
import PDFViewer from '../components/PDFViewer';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <h1>PDF Viewer</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {selectedFile && <PDFViewer pdfFile={selectedFile} />}
    </div>
  );
};

export default Home;
