// components/SignatureWindow.js
import React from 'react';
import Draggable from 'react-draggable';

const SignatureWindow = ({ signature, onClose }) => {
  return (
    <Draggable handle=".handle" defaultPosition={{ x: 0, y: 0 }}>
      <div className="border p-4 bg-white w-1/4">
        <div className="handle mb-2 cursor-move">
          <h2 className="text-lg font-bold">Signature Window</h2>
        </div>
        <div>
          <img src={signature} alt="Signature" className="w-full" />
        </div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Draggable>
  );
};

export default SignatureWindow;
