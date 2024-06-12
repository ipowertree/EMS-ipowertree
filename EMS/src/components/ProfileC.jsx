import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfileC() {
  const [loginData, setLoginData] = useState([]);
  const [clientData, setclientData] = useState({
    uid: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    locationLink: "",
    clientType: ""
  });

  useEffect(() => {
    const fetchAllRecord = async () => {
      try {
        const res = await axios.get("http://localhost:8001/clients");
        setLoginData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRecord();
  }, []);

  useEffect(() => {
    const uid = window.localStorage.getItem("uid");
    const client = loginData.find((item) => item.uid === uid);
    if (client) {
      setclientData(client);
    }
  }, [loginData]);

  localStorage.removeItem("isLoggedIn");
  window.localStorage.removeItem("isLoggedIn");

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="card">
              <div className="card-header text-center">
                <h2>PROFILE</h2>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group mb-3">
                    <label>
                      <b>Unique Id : </b> {clientData.uid}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Password : </b> {clientData.password}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Client Type : </b> {clientData.clientType}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Name : </b> {clientData.name}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Phone no : </b> {clientData.phone}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Address : </b> {clientData.address}
                    </label>
                    <br />
                    <br />
                    <label>
                      <b>Location Link : </b> {clientData.locationLink}
                    </label>
                    <br />
                    

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileC;
