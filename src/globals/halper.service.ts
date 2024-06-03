//#region  date formate
export const formateDate = (dateObj: any) => {
    const dateObject = new Date(dateObj);
    // Extract day, month, and year
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = dateObject.getFullYear();

    // Format the date to DD/MM/YYYY
    return `${day}/${month}/${year}`;
}
//#endregion

//#region  convert number into amount
export const convertReadableAmount = (amount: number) => {
    return ("$" + amount?.toLocaleString('en-US'))
}
//#endregion