import React from 'react'
import Ethlogo from '../svg_componets/Ethlogo'
import "./eth.css"

function Eth() {
  return (
    <div class="card">
  <Ethlogo/>
  <div class="textBox">
    <p class="text head">DocVerify</p>
    <span className='meu'>#decentralization</span>
    <p class="text price mid">A Decentralized way to verify your documents.</p>
  </div>
</div>

  )
}

export default Eth