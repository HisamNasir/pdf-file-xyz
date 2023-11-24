import React, { useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import SignatureCanvas from "react-signature-canvas";
import Draggable from "react-draggable";
import { PDFDocument } from "pdf-lib";
import Box from "@mui/material/Box";
import { FaBeer, FaDownload, FaSign, FaSignature } from "react-icons/fa";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import styles from "@/components/ResizableBox.module.css";

const PDFViewer = ({ pdfFile }) => {
  const [signatureImage, setSignatureImage] = useState(null);
  const signatureRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const draggableRef = useRef(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const [resizableBoxSize, setResizableBoxSize] = useState({ width: 200, height: 100 });

  // ...

  const handleResize = (event, { size }) => {
    setResizableBoxSize({ width: size.width, height: size.height });
  };
  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const saveSignature = () => {
    const signatureDataUrl = signatureRef.current.toDataURL();
    setSignatureImage(signatureDataUrl);

    if (draggableRef.current) {
      setShowDownloadButton(true);
      setModalOpen(false);
    }
  };

  const handleDragStop = () => {};


  const downloadSignedPDF = async () => {
    try {
      const pdfBytes = await fetch(pdfFile).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const draggableRect = draggableRef.current.getBoundingClientRect();
      const pdfRect = document
        .querySelector(".rpv-core__viewer")
        .getBoundingClientRect();
  
      const { width, height } = resizableBoxSize;
  
      const pngImage = await pdfDoc.embedPng(signatureImage);
  
      const pageNumber = Math.floor(
        ((draggableRect.top - pdfRect.top) / pdfRect.height) * pdfDoc.getPageCount()
      ) + 1;
  
      const page = pdfDoc.getPage(pageNumber - 1);
  
      const posX =
        ((draggableRect.left - pdfRect.left) / pdfRect.width) * page.getWidth();
      const posY =
        ((draggableRect.top - pdfRect.top) / pdfRect.height) * (page.getHeight()-150);
  
      page.drawImage(pngImage, {
        x: posX ,
        y: page.getHeight()-posY-height,
        width,
        height,
      });
  
      const updatedPdfBytes = await pdfDoc.save();
      const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
  
      // Download the updated PDF
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `signed_document.pdf`;
      link.click();
    } catch (error) {
      console.error("Error downloading signed PDF:", error);
    }
  };
  



  return (
    <div className="h-full relative">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={pdfFile} />
      </Worker>

      <div style={{ position: "fixed", bottom: 16, right: 16 }}>
        <Button
          className="bg-slate-700 flex flex-col space-y-2 p-4 rounded-2xl"
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          <span className=" text-2xl">
            <FaSignature />
          </span>{" "}
          <span className=" max-w-min text-xs">Signature</span>
        </Button>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: 430,
              height: 200,
              className: "border border border-black",
            }}
          />
          <div className="mt-2 flex">
            <Button
              className="bg-slate-700 w-full"
              variant="contained"
              color="primary"
              onClick={clearSignature}
            >
              Clear Signature
            </Button>
            <Button
              className="bg-slate-700 w-full"
              variant="contained"
              color="success"
              onClick={saveSignature}
              sx={{ marginLeft: 2 }}
            >
              Save Signature
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Draggable Signature Window */}
      {signatureImage && (
        <>
          <Draggable onStop={handleDragStop}>
            <div
              ref={draggableRef}
              className=" bottom-4 right-4 p-4 rounded border absolute resize-y  max-w-md border-black bg-white bg-opacity-20"
            >
              <ResizableBox
                className="rounded border absolute resize-y max-w-md border-black bg-white bg-opacity-20"
                width={resizableBoxSize.width}
                height={resizableBoxSize.height}
                onResize={handleResize}
              >
                <img src={signatureImage} alt="Signature" />
              </ResizableBox>
            </div>
          </Draggable>

          {showDownloadButton && (
            <div style={{ position: "fixed", bottom: 16, left: 16 }}>
              <Button
                className="bg-slate-700 flex flex-col space-y-2 p-4 rounded-2xl"
                variant="contained"
                onClick={downloadSignedPDF}
              >
                <span className=" text-2xl">
                  <FaDownload />
                </span>{" "}
                <span className=" max-w-min text-xs">Download Signed PDF</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewer;
