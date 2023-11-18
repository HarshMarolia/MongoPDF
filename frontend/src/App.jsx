import { useState } from 'react';
import axios from 'axios';
import PdfList from './pdfList';

function App() {
  const [file, setFile] = useState(null);

  const submitFileHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('PDF uploaded successfully');
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const fileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <form>
        <input type="file" onChange={fileHandler} />
        <button onClick={submitFileHandler}>Submit</button>
      </form>
      <PdfList />
    </>
  );
}

export default App;
