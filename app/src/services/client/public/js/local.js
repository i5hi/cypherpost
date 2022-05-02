const {request} = require("./request");


async function getLocalPrice(multiplier){
  const equation = (multiplier)
    ? ( "btc_in_usd*1*80*" + ( 1 + ( multiplier/100 ) ) )
    : "btc_in_usd*1*80";

    const url = "https://localbitcoins.com/api/equation/" + equation;

    const response = await request("GET", url);
    if (response instanceof Error) return response;
  
    return response;

}

module.exports =  {
  getLocalPrice
}