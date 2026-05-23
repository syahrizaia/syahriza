export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('id-ID', options);
};