import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import bitcoin from "../../utils/js/bitcoin"

import "../../css/mdb.min.css"
import "../../css/mdb.min.css.map"
import "../../css/light.css"
import "../../css/dark.css"
import "../../css/nav.css"
import Owl from "../../img/owl.png"

const Login = (props) => {

    // const username = useFormInput('');
    // const password = useFormInput('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        props.history.push('/dashboard');
    }
    
    // handle button click of login form
    // const handleLogin = () => {
    //     props.history.push('/dashboard');
    // }
    
    

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

                                    <p class="h4 mb-4">Login</p>

                                        <input type="text" id="login_username" class="" placeholder="Username"/>
                                        <br/>
                                        <input type="password" id="login_pass" class="" placeholder="Password"/>
                                        <br/>
                                        <button id="login_button" class="btn centerme" type="submit" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} >Enter</button>


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

export default Login;