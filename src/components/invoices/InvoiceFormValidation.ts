
export const validateInvoiceForm = (formData: {
  description: string;
  amount: string | number;
}) => {
  const errors: string[] = [];
  
  if (!formData.description) {
    errors.push("La description est requise");
  }
  
  if (!formData.amount) {
    errors.push("Le montant est requis");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
