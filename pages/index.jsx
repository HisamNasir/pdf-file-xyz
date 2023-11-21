import React, { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dropzone from 'react-dropzone';
import Box from '@mui/material/Box';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        PDF Viewer
      </Typography>
      <Dropzone onDrop={handleDrop} accept={['.pdf']}>

        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <Typography>Drag and drop a PDF file here, or click to select one.</Typography>
          </Box>
        )}
      </Dropzone>
      {selectedFile && <PDFViewer pdfFile={selectedFile} />}
    </Container>
  );
};

export default Home;
