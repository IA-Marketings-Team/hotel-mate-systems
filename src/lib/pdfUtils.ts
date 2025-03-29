
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import 'jspdf-autotable';

// Add the missing types for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateInvoicePDF = (transaction: Transaction): string => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("FACTURE", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Numéro de transaction: ${transaction.id}`, 20, 40);
  doc.text(`Date: ${format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}`, 20, 50);
  doc.text(`Type: ${transaction.type === "payment" ? "Paiement" : "Remboursement"}`, 20, 60);
  doc.text(`Méthode: ${
    transaction.method === "cash" ? "Espèces" : 
    transaction.method === "card" ? "Carte" : "Virement"
  }`, 20, 70);
  
  const tableColumn = ["Description", "Catégorie", "Sous-catégorie", "Montant"];
  const tableRows = [
    [
      transaction.description,
      transaction.category || "-",
      transaction.subcategory || "-",
      `${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`
    ]
  ];
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [66, 66, 66]
    }
  });
  
  doc.text(`Total: ${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`, 150, 130, { align: "right" });
  
  doc.setFontSize(10);
  doc.text("Merci pour votre confiance.", 105, 270, { align: "center" });
  
  const filename = `facture-${transaction.id}.pdf`;
  doc.save(filename);
  
  return filename;
};

export const generateTransactionCSV = (transaction: Transaction): string => {
  const headers = "ID,Date,Type,Méthode,Description,Catégorie,Sous-catégorie,Montant\n";
  const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy HH:mm");
  const type = transaction.type === "payment" ? "Paiement" : "Remboursement";
  const method = transaction.method === "cash" ? "Espèces" : 
                transaction.method === "card" ? "Carte" : "Virement";
  const category = transaction.category || "-";
  const subcategory = transaction.subcategory || "-";
  const amount = `${transaction.type === "payment" ? "" : "-"}${transaction.amount}`;
  
  const row = `"${transaction.id}","${formattedDate}","${type}","${method}","${transaction.description}","${category}","${subcategory}","${amount}"\n`;
  const csvContent = headers + row;
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `transaction-${transaction.id}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return `transaction-${transaction.id}.csv`;
};
