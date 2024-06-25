import React from "react";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div>
      <div id="header">
        <nav>
          <div id="logo-img">
            <img src="../Images/mainlogo.png" alt="logo" />
          </div>
          <ul>
            <li>{/* Empty list item */}</li>
          </ul>
        </nav>
      </div>
      <div id="bgimg">
        <div id="login">
          <a href="/login" className="login-button">
            LOGIN
          </a>
        </div>
      </div>

      <div id="section">
        {/* <h1>ABOUT US</h1> */}
        <p>
          Imagine Powertree Pvt Ltd is a Gandhinagar-based sustainable technology innovation company. 
          We specialize in the design, engineering, and manufacturing of Solar Trees that efficiently generate 
          electricity while saving space. Our innovative designs have earned us 16 design patents and numerous 
          recognitions, including being named among the United Nations' top 100 startups and the top 10 startups 
          in India by the Bombay Stock Exchange.
        </p>
      </div>


      <div id="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.7843319984286!2d72.63441207392998!3d23.17807021051013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e81bffaf8599b%3A0xdc264d311138a75d!2sImagine%20Powertree%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1716874567071!5m2!1sen!2sin"
          width="99.8%"
          height="100%"
          title="map"
        ></iframe>
      </div>
      
    </div>
  );
}

export default HomePage;
