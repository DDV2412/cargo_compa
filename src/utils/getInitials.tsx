export const getInitials = (name: string) => {
  let initials = "Global Rank ";
  if (name) {
    initials = name;
  }
  const initialsName = initials
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return initialsName.toUpperCase();
};
