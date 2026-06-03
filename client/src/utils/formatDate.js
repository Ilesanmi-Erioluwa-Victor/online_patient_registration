export const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Intl.DateTimeFormat('en-GB').format(new Date(value));
};

export const ageFromDob = (value) => {
  if (!value) return 'N/A';
  const dob = new Date(value);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
};
