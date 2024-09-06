export function formatCurrency(num) {
    if (num !== undefined) {
      return parseFloat(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
    }
  }
  

  // my new additions
export function calculateTax(obj) {
    // return Object.values(obj)
    //     .reduce((acc, { quantity, price }) => acc + quantity * price, 0)
    //     .toFixed(2);
  }
  
  /***Cart Totalling */
  export function calculateTotalCartAmount(obj) {
    return Object.values(obj).reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    );
    // .toFixed(2);
  }
  