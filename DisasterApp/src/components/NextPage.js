import React from 'react'

export default function NextPage(props) {
  return (
    <div>
     <div 
       className="card my-3 shadow-sm h-100" 
       style={{ 
         width: '100%',
         maxWidth: '18rem',
         borderRadius: '12px',
         border: 'none',
         transition: 'all 0.3s ease',
         cursor: 'pointer'
       }}
       onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-3px)'
         e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)'
         e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
       }}
     >
      <div className="card-body text-center d-flex flex-column">
         <h5 className="card-title fw-bold text-primary mb-3">{props.About}</h5>
         <p className="card-text text-muted" style={{ 
           fontSize: '0.9rem',
           lineHeight: '1.5'
         }}>
           {props.statement}
         </p>
         <a 
           href="#" 
          className="btn btn-primary btn-sm px-3 w-100 mt-auto"
           style={{
             borderRadius: '20px',
             fontWeight: '500',
             transition: 'all 0.3s ease'
           }}
           onMouseEnter={(e) => {
             e.target.style.transform = 'scale(1.05)'
           }}
           onMouseLeave={(e) => {
             e.target.style.transform = 'scale(1)'
           }}
         >
           Click here
         </a>
       </div>
     </div> 
    </div>
  )
}
