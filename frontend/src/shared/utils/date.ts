function formatTime(date: Date) {
  if (!date) return "";
  const dateReceived = new Date(date);

  return dateReceived
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
}

function formatDateDivider(date: Date) {
  if (!date) return null;
  const now = new Date();
  const dateReceived = new Date(date);
  const diff = now.getTime() - dateReceived.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return dateReceived.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export { formatTime, formatDateDivider };
