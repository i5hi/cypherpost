/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
import jwt from "jsonwebtoken";
import { handleError } from "../errors/e";
// ------------------ '(◣ ◢)' ----------------------
import { JWTInterface, JWTPayload } from "./interface";

const ONE_HOUR = 60*60*1000;
const ONE_DAY_MS = 1000 * 60 * 60 * 24;
const ONE_DAY_S = 60 * 60 * 24;

// ------------------ '(◣ ◢)' ----------------------
export class S5LocalJWT implements JWTInterface {
    async verify(token: string): Promise<any> { 
        try {
            const private_key = "supersecret";
            
            if (token===undefined || token === "")
            return handleError({
                code: 401,
                message: "Invalid token"
            });
            
            if (token.startsWith("Bearer ")) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }

            if (token) {
                const decoded = jwt.verify(token,private_key,{algorithm: "HS256"});
                // console.log({decoded});
                // console.log({now: Date.now(), exp: decoded.exp * 1000});
                // console.log(decoded.exp * 1000 - (Date.now()))
                if (decoded.exp * 1000 <(Date.now())) {
                    return handleError({
                        code: 401,
                        message: "Expired token"
                    });
                }
                else{
                    return (decoded);
                }

            } else {
                return handleError({
                    code: 401,
                    message: "Invalid token"
                });
            }
        } catch (e) {
            if(e.message==="jwt malformed" || e.message==="jwt expired" || e.message==="invalid token")
            return handleError({
                code: 401,
                message: "Invalid token"
            });

            return handleError(e);
        }

    }
    // ------------------ '(◣ ◢)' ----------------------
    async issue(payload: JWTPayload): Promise<string | Error> {
        try {
            const private_key = "supersecret";
            payload.iss = "lionbit";
            payload.iat = Date.now();
            payload.exp = payload.iat + ONE_DAY_MS * 2;
            
            return jwt.sign(
                {
                    payload
                },
                private_key,
                {
                    expiresIn: ONE_DAY_S * 2,
                    algorithm: "HS256",
                    audience: payload.aud,
                    issuer: payload.iss
                }
            );
            
            

        } catch (e) {
            return handleError(e);
        }

    }
    // ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
}

// ------------------ ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------