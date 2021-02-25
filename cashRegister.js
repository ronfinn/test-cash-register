
let denom = [
  { name: "100£", val: 100.0 },
  { name: "20£", val: 20.0 },
  { name: "10£", val: 10.0 },
  { name: "5£", val: 5.0 },
  { name: "1£", val: 1.0 },
  { name: "20p", val: 0.20 },
  { name: "10p", val: 0.1 },
  { name: "5p", val: 0.05 },
  { name: "1p", val: 0.01 }
];

function checkCashRegister(price, cash, cid) {
  let output = { status: null, change: [] };
  let change = cash - price;

  // Transform CID array into drawer object
  let register = cid.reduce(
    function(acc, curr) {
      acc.total += curr[1];
      acc[curr[0]] = curr[1];
      return acc;
    },
    { total: 0 }
  );

  // Handle exact change
  if (register.total === change) {
    output.status = "CLOSED";
    output.change = cid;
    return output;
  }

  // Handle obvious insufficient funds
  if (register.total < change) {
    output.status = "INSUFFICIENT_FUNDS";
    return output;
  }

  // Loop through the denomination array
  let change_arr = denom.reduce(function(acc, curr) {
    let value = 0;
    // While there is still money of this type in the drawer
    // And while the denomination is larger than the change remaining
    while (register[curr.name] > 0 && change >= curr.val) {
      change -= curr.val;
      register[curr.name] -= curr.val;
      value += curr.val;

      // Round change to the nearest hundreth deals with precision errors
      change = Math.round(change * 100) / 100;
    }
    // Add this denomination to the output only if any was used.
    if (value > 0) {
      acc.push([curr.name, value]);
    }
    return acc; // Return the current change_arr
  }, []); // Initial value of empty array for reduce

  // If there are no elements in change_arr or we have leftover change, return
  // the string "Insufficient Funds"
  if (change_arr.length < 1 || change > 0) {
    output.status = "INSUFFICIENT_FUNDS";
    return output;
  }

  // Here is your change, ma'am.
  output.status = "OPEN";
  output.change = change_arr;
  return output;
}

// test here
checkCashRegister(19.5, 20.0, [
  ["1p", 1.01],
  ["5p", 2.05],
  ["10p", 3.1],
  ["20p", 4.20],
  ["1£", 90.0],
  ["5£", 55.0],
  ["10£", 20.0],
  ["20£", 60.0],
  ["100£", 100.0]
]);