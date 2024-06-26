import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ClientDocs() {
  const { uid } = useParams();
  const [documents, setDocuments] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`https://ipowertree.onrender.com/clientDocuments/${uid}`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };
    fetchDocuments();
  }, [uid]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("docs", file); // Make sure this matches the backend's expected field name
    formData.append("documentName", documentName);

    try {
      const res = await axios.post(`https://ipowertree.onrender.com/clientDocuments/${uid}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDocuments([...documents, res.data.document]);
      setDocumentName("");
      setFile(null);
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error('Error uploading document:', err.response || err);
      alert("Failed to upload document.");
    }
  };

  const handleDelete = async (docId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (confirmDelete) {
      try {
        const res = await axios.delete(`https://ipowertree.onrender.com/clientDocuments/${uid}/${docId}`, {
          headers: {
            'Access-Control-Allow-Origin': 'https://ipower.vercel.app',
          }
        });
        console.log('Delete response:', res.data);
        setDocuments(documents.filter(doc => doc._id !== docId));
      } catch (err) {
        console.error('Error deleting document:', err.response || err);
        alert("Failed to delete document.");
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-5">Upload New Document</h4>
          <form onSubmit={handleUpload}>
            <div className="form-group mb-4">
              <label htmlFor="documentName">Document Name:</label>
              <input
                id="documentName"
                type="text"
                className="form-control"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="fileUpload">Upload Document:</label>
              <br/>
              <small>Supported file types: PDF, DOC, DOCX, PNG, JPG, JPEG</small>
              <input
                id="fileUpload"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-orange text-center btn-sm">Upload</button>
            </div>
          </form>
        </div>
      </div>
      <h4 className="mt-5 text-center">Existing Documents</h4>
      {documents.length === 0 ? (
        <p className="text-center">No documents uploaded.</p>
      ) : (
        <div className="card mt-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <ul className="list-group list-group-flush">
            {documents.map((doc) => (
              <li key={doc._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{doc.documentName}</strong> - <a href={`https://ipowertree.onrender.com/${doc.docs[0]}`} target="_blank" rel="noopener noreferrer">View</a>
                </div>
                <button className="btn btn-danger btn-xs" onClick={() => handleDelete(doc._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClientDocs;
