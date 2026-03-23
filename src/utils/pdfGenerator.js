import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addReport } from './loanStore';

export const generateSettlementPDF = (month, loans) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // --primary color
    doc.text('Finance Monthly Settlement Report', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Month: ${month}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    // Table
    const tableColumn = ["No", "Customer Name", "Phone", "Principal", "Interest", "Total", "Due Date"];
    const tableRows = [];

    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalExpected = 0;

    loans.forEach((loan, index) => {
        const loanData = [
            index + 1,
            loan.customerName,
            loan.phone,
            `Rs. ${loan.principalAmount}`,
            `Rs. ${loan.interest}`,
            `Rs. ${loan.totalAmount}`,
            loan.dueDate
        ];
        tableRows.push(loanData);

        totalPrincipal += parseFloat(loan.principalAmount);
        totalInterest += parseFloat(loan.interest);
        totalExpected += parseFloat(loan.totalAmount);
    });

    doc.autoTable(tableColumn, tableRows, {
        startY: 45,
        theme: 'striped',
        headStyles: {
            fillColor: [15, 23, 42],
            fontSize: 10,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            valign: 'middle'
        },
        columnStyles: {
            0: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' }
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        }
    });

    // Summary at bottom
    const finalY = doc.lastAutoTable.finalY + 20;

    // Summary box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, finalY - 5, 182, 45, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont(undefined, 'normal');
    doc.text('Summary', 20, finalY + 5);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Total Members:`, 20, finalY + 15);
    doc.text(loans.length.toString(), 190, finalY + 15, { align: 'right' });

    doc.text(`Total Principal:`, 20, finalY + 22);
    doc.text(`Rs. ${totalPrincipal.toFixed(2)}`, 190, finalY + 22, { align: 'right' });

    doc.text(`Total Interest:`, 20, finalY + 29);
    doc.text(`Rs. ${totalInterest.toFixed(2)}`, 190, finalY + 29, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(20, finalY + 33, 190, finalY + 33);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Expected Collection:`, 20, finalY + 39);
    doc.text(`Rs. ${totalExpected.toFixed(2)}`, 190, finalY + 39, { align: 'right' });

    const filename = `Finance-Report-${month.replace(' ', '-')}.pdf`;
    doc.save(filename);

    // Save to history via Supabase-backed store
    addReport({
        month,
        members: loans.length,
        total: totalExpected.toFixed(2),
        filename,
    });
};
