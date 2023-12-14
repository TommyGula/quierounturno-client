export function handlePromises(promises) {
  const superPromise = new Promise((res, rej) => {
    Promise.all(promises).then((values) => {
      // Resolve the outer promise
      res(values);
    });
  });

  return superPromise; // Return the promise so it can be chained or awaited externally
};

export const createDate = (date, time=false, sep=false, format="dd-mm-YYYY HH:MM:SS") => {
  let day = date.getDay();
  let month = date.getMonth();
  let year = date.getYear();
  
  let finalDate = format.replace("YYYY", year).replace("mm", month).replace("dd", day);

  if (sep) {
      finalDate.replace("-", sep);
  }
  if (time) {
      let hour = date.getHours();
      let minutes = addDigit(date.getMinutes(), 2, "0", true);
      let seconds = addDigit(date.getSeconds(), 2, "0", true);

      finalDate = finalDate.replace("HH", hour).replace("MM", minutes).replace("SS", seconds);
  } else {
      finalDate = finalDate.split(" ")[0];
  };
  
  return finalDate;
};

export const addDigit = (str, n, digit="0", left=false) => {
  str = str.toString();
  if (str.length < n) {
      let newStr = str;
      for (let i = 0; i < n - str.length; i++) {
          if (left) {
              newStr = digit + newStr;
          } else {
              newStr = newStr + digit;
          };
      };
      return newStr;
  } else {
      return str;
  }
}

export const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];