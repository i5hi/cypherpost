import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, Router, Link, BrowserRouter } from "react-router-dom";

import bitcoin from "../../utils/js/bitcoin"
// import "../../mdb.min.css"
import "../../css/mdb.min.css"
import "../../css/mdb.min.css.map"
import "../../css/light.css"
import "../../css/dark.css"
import "../../css/nav.css"

import Owl from "../../img/owl.png"

const Index = () => {
    
    return (
        <div>
            
            <main>

                <div class="container">
                    <div class="row">
                        <div class="col-sm-12 col-md-12 col-lg-12"></div>

                        <div class="col-sm-12 col-md-12 col-lg-12">
                            <img class="sats-ico centerme" loading="lazy" src={Owl} href="https://cypherpost.io"></img>

                            <div class="text-center" action="#!">
                                
                                <Link to="/login">
                                    <button id="home_login" class="btn"> Enter </button>
                                </Link>                                    
                            
                                <br></br>
                                <br></br>
                                
                                
                                <Link to="/reset">
                                    <button id="home_reset" class="btn">Reset</button>
                                </Link>

                                <br></br>
                                <br></br>
                                <hr></hr>
                                <div class="row">
                                    <div class='col-4'>
                                        <a href="privacy.html">Privacy</a>
                                    </div>
                                    <div class='col-4'>
                                        <a href="protocol.html">Protocol</a>
                                    </div>
                                    <div class='col-4'>
                                        <a href="https://github.com/i5hi/cypherpost">Code</a>
                                    </div>
                                </div>
                                <hr></hr>

                            </div>


                        </div>

                    </div>
                </div>

            </main>

            <footer class="page-footer font-small teal pt-4">

                <div class="container-fluid text-center text-md-left">

                    <div class="footer-copyright text-center py-3">

                        <a href="https://cypherpost.io"> cypherpost.io</a> 2021
                        <br></br>

                        <i class="fab fa-bitcoin"></i>
                        <i class="fab fa-linux"></i>
                        <i class="fab fa-creative-commons"></i>
                     </div>
                </div>

            </footer>

        </div>
    )
  }

export default Index;