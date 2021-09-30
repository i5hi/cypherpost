/*
cypherpost.io
Developed @ Stackmate India
*/

import { GlobalTimes, TimeInterface } from "./interface";

export class S5Times implements TimeInterface {
  convertUnixToGlobal(timestamp: number): GlobalTimes | Error {
    return global(timestamp);
  }
  convertUnixToIST(timestamp: number): string | Error {
    return ist(timestamp);
  }
  convertUnixToDST(timestamp: number): string | Error {
    return dst(timestamp);
  }

}
export function global(timestamp: number) {
  // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  const london = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Europe/London"
  });
  // const londonTimeTForm = new Date(london);

  const brisbane = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Australia/Brisbane"
  });
  // const aestTimeTForm = new Date(brisbane);

  const shanghai = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Asia/Shanghai"
  });
  // const asiaTimeTForm = new Date(kolkata);

  const vancouver = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "America/Vancouver"
  });
  // const canadaWestTimeTForm = new Date(vancouver);

  const kolkata = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
  });
  // const indiaTimeTForm = new Date(kolkata);

  const nyc = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "America/New_york"
  });
  // const usaTimeTForm = new Date(nyc);

  const amsterdam = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Europe/Amsterdam"
  });
  // const netherlandsTimeTForm = new Date(amsterdam);

  const curacao = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "America/Curacao"
  });
  // const curacaoTimeTForm = new Date(curacao);

  return {
    brisbane,
    shanghai,
    nyc,
    kolkata,
    vancouver,
    amsterdam,
    curacao,
    london
  }
};


export function ist(timestamp: number): string | Error {
  const indiaTime = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata"
  });
  // const indiaTimeTForm = new Date(indiaTime);
  return indiaTime;

}

export function dst(timestamp: number): string | Error  {
  const netherlandsTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Amsterdam"
  });
  // const netherlandsTimeTForm = new Date(netherlandsTime);
  return netherlandsTime;
}