import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import bitcoin from "../../utils/js/bitcoin"

const Dashboard = () => {
    let words = bitcoin.generate_mnemonic()
    console.log(words);
    return (
        <div>
            Hello from Dashboard {words}
        </div>
    )
  }

export default Dashboard;