/*
cypherpost.io
Developed @ Stackmate India
*/

export interface TimeInterface{
 convertUnixToGlobal(timestamp: number): GlobalTimes | Error;
 convertUnixToIST(timestamp:number): string | Error;
 convertUnixToDST(timestamp:number): string | Error;
}

export interface GlobalTimes{
    brisbane: string,
    shanghai: string,
    nyc: string,
    kolkata: string,
    vancouver: string,
    amsterdam: string,
    curacao: string,
    london: string
}