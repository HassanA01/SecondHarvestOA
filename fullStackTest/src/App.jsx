/**
 * Main App component for Second Harvest Food Rescue Test
 * @module App
 */

import React from 'react';
import DonationForm from './components/DonationForm';
import './index.css';

/**
 * App component constructor.
 * @memberof module:App
 */
function App() {
  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Second Harvest Food Rescue</h1>
            <p className="app-subtitle">Full Stack Developer Test</p>
          </div>
        </header>
        
        <main className="main-content">
          <div className="content-wrapper">
            <h2 className="page-title">Create Food Donation</h2>
            <p className="page-description">
              Please fill out the form below to create a new food donation.
            </p>
            <DonationForm />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
