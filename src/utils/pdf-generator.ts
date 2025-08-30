import jsPDF from 'jspdf';
import { Patient } from '@/components/datatable/interfaces/patient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPhone, calculateAge } from './format';





export interface ReportOptions {
  startDate?: string;
  endDate?: string;
  title?: string;
}

export const generatePatientsPDF = (patients: Patient[], options: ReportOptions = {}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Configurar fonte
  doc.setFont('helvetica');

  // Título do relatório
  const title = options.title || 'Relatório de Pacientes';
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Período do relatório
  if (options.startDate && options.endDate) {
    const startFormatted = format(new Date(options.startDate), 'dd/MM/yyyy', { locale: ptBR });
    const endFormatted = format(new Date(options.endDate), 'dd/MM/yyyy', { locale: ptBR });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${startFormatted} a ${endFormatted}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
  }

  // Data de geração
  doc.setFontSize(10);
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Total de pacientes
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total de pacientes: ${patients.length}`, margin, yPosition);
  yPosition += 15;

  // Cabeçalho da tabela
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const headers = ['Nome', 'Espécie', 'Sexo', 'Idade', 'Tutor', 'Telefone'];
  const colWidths = [30, 25, 15, 15, 40, 35];
  let xPosition = margin;

  // Desenhar cabeçalho
  headers.forEach((header, index) => {
    doc.text(header, xPosition, yPosition);
    xPosition += colWidths[index];
  });
  
  // Linha separadora
  yPosition += 5;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Dados dos pacientes
  doc.setFont('helvetica', 'normal');
  
  patients.forEach((patient, index) => {
    // Verificar se precisa de nova página
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
      
      // Repetir cabeçalho na nova página
      doc.setFont('helvetica', 'bold');
      xPosition = margin;
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 5;
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
    }

    xPosition = margin;
    const age = patient.dateBirth ? calculateAge(patient.dateBirth) : 'N/A';
    const phone = formatPhone(patient.ownerPhone);
    
    const rowData = [
      patient.name,
      patient.species,
      patient.sex,
      `${age} anos`,
      patient.ownerName,
      phone
    ];

    rowData.forEach((data, colIndex) => {
      // Truncar texto se for muito longo
      const maxLength = Math.floor(colWidths[colIndex] / 2.5);
      const text = data.length > maxLength ? data.substring(0, maxLength - 3) + '...' : data;
      doc.text(text, xPosition, yPosition);
      xPosition += colWidths[colIndex];
    });

    yPosition += 8;
  });

  // Rodapé
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Relatório gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar o PDF
  const fileName = `relatorio-pacientes-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
  doc.save(fileName);
};