"use server";
import React from 'react'
import FromBank from './FromBank';

export default async function page() {
  return (
    <div>
      <h1>From Bank</h1>
      <FromBank/>
    </div>
  )
}
