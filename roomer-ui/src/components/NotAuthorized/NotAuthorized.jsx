import * as React from "react";
import "./NotAuthorized.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function NotAuthorized() {
  const nav = useNavigate();

  return (
    <div className='unauthorized-page'>
      <h1 className='not-authorized'>Sorry, you are not authorized to view this page.</h1>
      <Button size='lg' className='redirect' onClick={()=>{nav('/')}}> Go back to home </Button>
      <Button size='lg' className='redirect' onClick={()=>{nav('/login')}}> Go to Login </Button>
    </div>
  );
}
