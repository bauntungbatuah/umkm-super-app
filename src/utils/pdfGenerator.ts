import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order: any, store: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text(store.name.toUpperCase(), 14, 25);
  doc.setFontSize(24);
  doc.text('INVOICE', pageWidth - 14, 25, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(`Kepada: ${order.customer_name}`, 14, 55);
  doc.text(`Telepon: ${order.customer_phone}`, 14, 62);
  doc.text(`Tanggal: ${new Date(order.created_at).toLocaleDateString('id-ID')}`, 14, 69);
  
  const items = order.order_items?.map((item: any) => [
    item.product_name,
    item.quantity.toString(),
    `Rp ${item.price.toLocaleString()}`,
    `Rp ${(item.price * item.quantity).toLocaleString()}`
  ]) || [];
  
  (doc as any).autoTable({
    startY: 80,
    head: [['Produk', 'Qty', 'Harga', 'Subtotal']],
    body: items,
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total: Rp ${order.grand_total?.toLocaleString()}`, pageWidth - 14, finalY, { align: 'right' });
  
  doc.save(`Invoice-${order.id?.slice(0, 8)}.pdf`);
};

export const generateNota = (order: any, store: any) => {
  const doc = new jsPDF('p', 'mm', [80, 297]);
  let y = 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(store.name.toUpperCase(), 40, y, { align: 'center' });
  y += 8;
  
  doc.setFontSize(8);
  doc.text(`#${order.id?.slice(0, 8)}`, 40, y, { align: 'center' });
  y += 5;
  doc.text(new Date(order.created_at).toLocaleString('id-ID'), 40, y, { align: 'center' });
  y += 10;
  
  order.order_items?.forEach((item: any) => {
    doc.setFont('helvetica', 'bold');
    doc.text(item.product_name.substring(0, 25), 5, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.quantity} x Rp ${item.price.toLocaleString()}`, 5, y);
    doc.text(`Rp ${(item.price * item.quantity).toLocaleString()}`, 75, y, { align: 'right' });
    y += 6;
  });
  
  y += 2;
  doc.line(5, y, 75, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 5, y);
  doc.text(`Rp ${order.grand_total?.toLocaleString()}`, 75, y, { align: 'right' });
  
  doc.save(`Nota-${order.id?.slice(0, 8)}.pdf`);
};