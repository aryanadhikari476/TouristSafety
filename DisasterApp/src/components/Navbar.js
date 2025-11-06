import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Navbar() {
  return (
    <div>
      <nav 
        className="navbar navbar-expand-lg navbar-dark shadow-sm" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1rem 0'
        }}
      >
        <div className="container">
          <a 
            className="navbar-brand fw-bold" 
            href="#"
            style={{
              fontSize: '1.5rem',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.textShadow = '0 4px 8px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🏖️ SAFETY-HUB
          </a>
          
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a 
                  className="nav-link fw-semibold" 
                  href="#"
                  style={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    borderRadius: '20px',
                    padding: '0.5rem 1rem',
                    margin: '0 0.2rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  🏠 Home
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link fw-semibold" 
                  href="#"
                  style={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    borderRadius: '20px',
                    padding: '0.5rem 1rem',
                    margin: '0 0.2rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  🔗 Services
                </a>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle fw-semibold" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{
                    color: 'white',
                    transition: 'all 0.3s ease',
                    borderRadius: '20px',
                    padding: '0.5rem 1rem',
                    margin: '0 0.2rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  📋 More
                </a>
                <ul 
                  className="dropdown-menu" 
                  aria-labelledby="navbarDropdown"
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    marginTop: '0.5rem'
                  }}
                >
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#"
                      style={{
                        transition: 'all 0.3s ease',
                        borderRadius: '5px',
                        margin: '0.2rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      🎯 Action
                    </a>
                  </li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#"
                      style={{
                        transition: 'all 0.3s ease',
                        borderRadius: '5px',
                        margin: '0.2rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      ⚡ Another action
                    </a>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <a 
                      className="dropdown-item" 
                      href="#"
                      style={{
                        transition: 'all 0.3s ease',
                        borderRadius: '5px',
                        margin: '0.2rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      🌟 Something else
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a 
                  className="nav-link fw-semibold" 
                  href="#" 
                  tabIndex="-1" 
                  aria-disabled="true"
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'not-allowed'
                  }}
                >
                  🔒 Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
