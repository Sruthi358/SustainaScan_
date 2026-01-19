import React from 'react';
import ProductListing from "./ProductListing";
import NavBarUser from "./NavBarUser";

export default function UserHome() {
  return (
    <>
      <NavBarUser AboutAccount="Your Details" />
      <ProductListing />
    </>
  )
}
