// src/utils/exportUtils.js
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Universal Export Utility - Can be used across all pages
 * Supports Excel and PDF exports with customizable configurations
 */

class ExportUtils {
  
  /**
   * Export data to Excel file
   * @param {Object} config - Export configuration
   * @param {string} config.filename - Output filename (without extension)
   * @param {Array} config.sheets - Array of sheet configurations
   * @param {string} config.sheets[].name - Sheet name
   * @param {Array} config.sheets[].data - Sheet data (2D array or array of objects)
   * @param {Array} config.sheets[].headers - Column headers (for object data)
   * @param {Array} config.sheets[].columnWidths - Optional column widths
   * @param {string} config.title - Report title
   * @param {string} config.subtitle - Report subtitle/filter info
   */
  static exportToExcel(config) {
    try {
      const workbook = XLSX.utils.book_new()
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `${config.filename || 'report'}_${timestamp}.xlsx`

      // Add info sheet if title provided
      if (config.title) {
        const infoData = [
          [config.title, ''],
          ['Generated:', new Date().toLocaleString()],
          ['Filter:', config.subtitle || 'All data'],
          ['', '']
        ]
        const infoSheet = XLSX.utils.aoa_to_sheet(infoData)
        infoSheet['!cols'] = [{ wch: 20 }, { wch: 40 }]
        XLSX.utils.book_append_sheet(workbook, infoSheet, 'Report Info')
      }

      // Process each sheet
      config.sheets.forEach(sheet => {
        let sheetData = []
        
        if (sheet.headers && sheet.data.length > 0 && typeof sheet.data[0] === 'object') {
          // Convert object array to 2D array with headers
          sheetData = [sheet.headers]
          sheet.data.forEach(item => {
            const row = sheet.headers.map(header => {
              let value = item[header.key || header]
              // Format currency if needed
              if (header === 'Total Spent' || header === 'Revenue' || header === 'Amount' || header === 'Price') {
                if (typeof value === 'number') value = `₱${value.toLocaleString()}`
              }
              return value ?? ''
            })
            sheetData.push(row)
          })
        } else {
          // Use data as is (should be 2D array)
          sheetData = sheet.data
        }

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
        
        // Set column widths if provided
        if (sheet.columnWidths) {
          worksheet['!cols'] = sheet.columnWidths.map(w => ({ wch: w }))
        }
        
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
      })

      XLSX.writeFile(workbook, filename)
      return { success: true, filename }
    } catch (error) {
      console.error('Excel export error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Export data to PDF file
   * @param {Object} config - Export configuration
   * @param {string} config.filename - Output filename (without extension)
   * @param {string} config.title - Report title
   * @param {string} config.subtitle - Report subtitle/filter info
   * @param {Array} config.sections - Array of section configurations
   * @param {string} config.sections[].title - Section title
   * @param {Array} config.sections[].headers - Table headers
   * @param {Array} config.sections[].data - Table data (2D array)
   * @param {Object} config.sections[].columnStyles - Optional column styles
   * @param {string} config.orientation - 'portrait' or 'landscape' (default: 'landscape')
   */
  static async exportToPDF(config) {
    try {
      const doc = new jsPDF({ 
        orientation: config.orientation || 'landscape', 
        unit: 'mm', 
        format: 'a4' 
      })
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `${config.filename || 'report'}_${timestamp}.pdf`
      
      let yOffset = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      
      // Helper to add new page
      const checkPage = (needed = 40) => {
        if (yOffset > 240) {
          doc.addPage()
          yOffset = 20
          return true
        }
        return false
      }

      // Helper to add footer
      const addFooter = () => {
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.setTextColor(150, 150, 150)
          doc.text(
            `Generated: ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            285,
            { align: 'center' }
          )
        }
      }

      // Title
      doc.setFontSize(22)
      doc.setTextColor(37, 99, 235)
      doc.text(config.title, 20, yOffset)
      yOffset += 12
      
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yOffset)
      if (config.subtitle) {
        doc.text(`Filter: ${config.subtitle}`, 20, yOffset + 6)
        yOffset += 16
      } else {
        yOffset += 10
      }

      // Process each section
      for (const section of config.sections) {
        checkPage()
        
        if (section.data && section.data.length > 0) {
          doc.setFontSize(14)
          doc.setTextColor(0, 0, 0)
          doc.text(section.title, 20, yOffset)
          yOffset += 8
          
          // Format data for autoTable
          let tableData = section.data
          
          // If data contains objects, extract values based on headers
          if (section.data.length > 0 && typeof section.data[0] === 'object' && !Array.isArray(section.data[0])) {
            tableData = section.data.map(row => {
              return section.headers.map(header => {
                let value = row[header.key || header]
                // Format currency
                if (header === 'Total Spent' || header === 'Revenue' || header === 'Amount' || header === 'Price' || 
                    header === 'totalSpent' || header === 'revenue') {
                  if (typeof value === 'number') value = `₱${value.toLocaleString()}`
                }
                // Format percentage
                if (header === 'Percentage' && typeof value === 'number') value = `${value}%`
                return value ?? ''
              })
            })
          }
          
          autoTable(doc, {
            startY: yOffset,
            head: [section.headers.map(h => typeof h === 'object' ? h.label : h)],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            columnStyles: section.columnStyles || {},
            margin: { left: 20, right: 20 }
          })
          yOffset = doc.lastAutoTable.finalY + 10
        }
      }

      addFooter()
      doc.save(filename)
      return { success: true, filename }
    } catch (error) {
      console.error('PDF export error:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Export simple data (single table) to Excel
   */
  static exportSimpleExcel(filename, sheetName, headers, data, columnWidths = null) {
    return this.exportToExcel({
      filename,
      title: filename,
      sheets: [{
        name: sheetName,
        headers: headers,
        data: data,
        columnWidths: columnWidths
      }]
    })
  }

  /**
   * Export simple data (single table) to PDF
   */
  static exportSimplePDF(filename, title, subtitle, headers, data, columnStyles = null) {
    return this.exportToPDF({
      filename,
      title,
      subtitle,
      sections: [{
        title: title,
        headers: headers,
        data: data,
        columnStyles: columnStyles
      }]
    })
  }
}

export default ExportUtils