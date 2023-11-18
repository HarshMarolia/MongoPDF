import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PdfList() {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    // Fetch the list of PDFs from the server
    axios.get('http://localhost:3000/pdfs')  // Ensure the URL is correct
      .then((response) => {
        setPdfs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PDFs:', error);
      });
  }, []);
  

  const downloadPdf = (id, name) => {
    // Trigger a download for a specific PDF
    axios.get(`http://localhost:3000/pdfs/${id}`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading PDF:', error);
      });
  };

  return (
    <div>
      <h2>List of PDFs</h2>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf._id}>
            {pdf.name} <button onClick={() => downloadPdf(pdf._id, pdf.name)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PdfList;
