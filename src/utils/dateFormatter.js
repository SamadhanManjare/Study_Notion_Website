export const formattedDate = (date) => {
  // Formats a date into "Month Day, Year" format
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }