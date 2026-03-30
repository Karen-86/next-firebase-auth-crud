  export function formatTimestampToDate(timestamp: any) {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  export const formatWithCommas = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!/^\d+$/.test(num)) return value;
    return Number(num).toLocaleString();
  };

  export const unformatFromCommas = (value: string) => value.replace(/,/g, "");