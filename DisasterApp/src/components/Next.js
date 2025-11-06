import React from 'react'
import NextPage from './NextPage'
import NextPageTracking from './NextPageTracking'
import NextPageSos from './NextPageSos'
export default function Next() {
  return (
    <div className="container py-4 app-theme">
     <div className="row g-4">
     
      <div className="col-md-4"><NextPage
        statement={"AI provides tourists with real-time safety alerts, advice, and preventive guidance for secure, worry-free travel experiences everywhere."}
         About={"AI"}/></div>
      <div className="col-md-4"><NextPageTracking
        statement={"Live map tracking highlights safe routes, shares location with contacts, and alerts tourists when entering risky zones instantly."}
         About={"Map-Tracking"}/></div>
      <div className="col-md-4"><NextPageSos
        statement={"One-tap panic button instantly shares location with authorities and trusted contacts, ensuring fast help during emergencies anywhere."} 
        About={"PANIC-BUTTON"}/></div>
     </div>
     <div className="row g-4 mt-2">
    <div className="col-md-4"><NextPage
      statement={"A blockchain-based digital ID for tourists ensures secure verification at checkpoints, hotels, and emergencies with complete privacy."}
       About={"DIGITAL-ID"}/></div>
    <div className="col-md-4"><NextPage
      statement={"Tourists can quickly file online complaints for theft, loss, or harassment, ensuring fast police response and support anytime."}
       About={"E_FIR"}/></div>
    <div className="col-md-4"><NextPage
      statement={"Every place is assigned a safety score based on data, helping tourists choose safe locations before traveling confidently."} 
      About={"Tourist-Safty-Score"}/></div>

     </div>
    </div>
  )
}
