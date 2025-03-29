
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
  try {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Facture ${transaction.id}`,
      subject: `Facture pour ${transaction.description}`,
      author: 'Système de Gestion Hôtelière',
      keywords: 'facture, transaction, hôtel',
      creator: 'Hotel Management System'
    });
    
    // Add header
    doc.setFontSize(20);
    doc.text("FACTURE", 105, 20, { align: "center" });
    
    // Add company info
    doc.setFontSize(10);
    doc.text("Hôtel Paradis", 20, 30);
    doc.text("123 Avenue des Palmiers", 20, 35);
    doc.text("06400 Cannes, France", 20, 40);
    doc.text("Tel: +33 4 93 XX XX XX", 20, 45);
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Numéro de facture: ${transaction.id}`, 120, 30);
    doc.text(`Date: ${format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}`, 120, 35);
    
    // Add client information if available
    if (transaction.clientName) {
      doc.setFontSize(12);
      doc.text("Informations client:", 20, 60);
      doc.setFontSize(10);
      doc.text(`Nom: ${transaction.clientName}`, 20, 65);
    }
    
    // Add staff information if available
    if (transaction.staffName) {
      doc.setFontSize(10);
      doc.text(`Personnel: ${transaction.staffName}`, 120, 40);
    }
    
    doc.text(`Type: ${transaction.type === "payment" ? "Paiement" : "Remboursement"}`, 20, 80);
    doc.text(`Méthode: ${
      transaction.method === "cash" ? "Espèces" : 
      transaction.method === "card" ? "Carte" : "Virement"
    }`, 20, 85);
    
    // Add transaction details
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
      startY: 95,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [66, 66, 66]
      }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 130;
    
    // Add total
    doc.setFontSize(12);
    doc.text(`Total: ${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`, 150, finalY + 10, { align: "right" });
    
    // Add payment information
    doc.setFontSize(10);
    doc.text("Informations de paiement:", 20, finalY + 25);
    doc.text("IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX", 20, finalY + 30);
    doc.text("BIC: XXXFRPPXXX", 20, finalY + 35);
    
    // Add footer
    doc.setFontSize(8);
    doc.text("Merci pour votre confiance. Cette facture a été générée automatiquement et ne nécessite pas de signature.", 105, finalY + 50, { align: "center" });
    doc.text("© Hôtel Paradis - SIRET: 123 456 789 00015", 105, finalY + 55, { align: "center" });
    
    const filename = `facture-${transaction.id}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate invoice PDF");
  }
};

export const generateTransactionCSV = (transaction: Transaction): string => {
  try {
    const headers = "ID,Date,Type,Méthode,Description,Catégorie,Sous-catégorie,Montant,Client,Personnel\n";
    const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy HH:mm");
    const type = transaction.type === "payment" ? "Paiement" : "Remboursement";
    const method = transaction.method === "cash" ? "Espèces" : 
                  transaction.method === "card" ? "Carte" : "Virement";
    const category = transaction.category || "-";
    const subcategory = transaction.subcategory || "-";
    const amount = `${transaction.type === "payment" ? "" : "-"}${transaction.amount}`;
    const client = transaction.clientName || "-";
    const staff = transaction.staffName || "-";
    
    const row = `"${transaction.id}","${formattedDate}","${type}","${method}","${transaction.description}","${category}","${subcategory}","${amount}","${client}","${staff}"\n`;
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
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw new Error("Failed to generate transaction CSV");
  }
};
