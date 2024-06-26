import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CheckUpdC.css"; // Reuse the same CSS file

function CheckUpdC() {
  const [documents, setDocuments] = useState([]);
  const [userId, setUserId] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      setUserId(uid);
    }
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`https://ipowertree.onrender.com/clientDocuments/${userId}`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };
    fetchDocuments();
  }, [userId]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header text-center">
              <h2 className="text-white">DOCUMENTS</h2>
            </div>
            <div className="card-body">
              {documents.length === 0 ? (
                <p className="text-center">No documents uploaded.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {documents.map((doc) => (
                    <li key={doc._id} className="list-group-item">
                      <strong>{doc.documentName}</strong> - <a href={`https://ipowertree.onrender.com/${doc.docs[0]}`} target="_blank" rel="noopener noreferrer">View</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckUpdC;
