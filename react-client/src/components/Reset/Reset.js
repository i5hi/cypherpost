import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import bitcoin from "../../utils/js/bitcoin"

import "../../css/mdb.min.css"
import "../../css/mdb.min.css.map"
import "../../css/light.css"
import "../../css/dark.css"
import "../../css/nav.css"
import Owl from "../../img/owl.png"

const Reset = () => {
    

    return (
        <div>
            <body>

                <header>

                    <img class="sats-ico" loading="lazy" src={Owl} href="https://cypherpost.io"></img>
                    BETA
                    <div class='container-fluid nav-line'></div>

                </header>


                <br></br>


                <main>

                    <div class="container">
                        <div class="row">
                            <div class="col-sm-12 col-md-12 col-lg-12"></div>

                            <div class="col-sm-12 col-md-12 col-lg-12">

                            <form class="text-center" action="#!">

                                <p class="h4 mb-4">Reset</p>
                                <p class="stathead liquid-color">Type your 12 word mnemonic phrase to recover your account. You must reset
                                your
                                password, even for a forgotten username.</p>
                                <br/>
                                <input type="text" id="reset_seed" class="" placeholder="Mnemonic"/>
                                <br/>

                                <input type="password" id="reset_pass" class="" placeholder="New Password"/>
                                <br/>

                                <input type="password" id="reset_confirm_pass" class="" placeholder="Confirm New Password"/>
                                <br/>


                                <button id="reset_button" class="btn " type="submit">Submit</button>


                                </form>
                            </div>
                            <div class="col-sm-12 col-md-12 col-lg-12"/>

                        </div>
                    </div>

                </main>

                <footer class="page-footer font-small teal pt-4">

                    <div class="container-fluid text-center text-md-left">

                        <div class="footer-copyright text-center py-3">

                            <a href="https://cypherpost.io"> cypherpost.io</a> 2021
                            <br/>

                            <i class="fab fa-bitcoin"></i>
                            <i class="fab fa-linux"></i>
                            <i class="fab fa-creative-commons"></i>
                        </div>
                    </div>
   
                </footer>

            </body>

        </div>
    )
  }

export default Reset;