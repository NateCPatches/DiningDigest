import storage from "../config/firebase.js"
import {} from "./calculations.js";
import csv from 'csv-parser';
import { createReadStream } from 'fs';

class CSVProcessor {
  constructor() {
    this.storage = storage;
  }

  async getCSVList() {
try {
    // Assuming storage is a Firebase storage reference
    const files = await this.storage.listAll();
  return files.items.filter(file => file.name.endsWith('.csv'));
} catch (error) {
    console.error('Error fetching CSV list:', error);
    throw error;
}
}

/**
   * Download and parse a single CSV file
   */
  async parseCSV(csvFile) {
    try {
      const url = await csvFile.getDownloadURL();
      const response = await fetch(url);
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        const results = [];
        
        // Using csv-parser approach
        const stream = require('stream');
        const readable = new stream.Readable();
        readable.push(csvText);
        readable.push(null);
        
        readable
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', () => resolve(results))
          .on('error', reject);
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      throw error;
    }
  }

/**
   * Process all CSV files using calculations methods
   */
  async processAllCSVs() {
    try {
      const csvFiles = await this.getCSVList();
      const processedResults = [];

      for (const csvFile of csvFiles) {
        console.log(`Processing: ${csvFile.name}`);
        
        // Parse the CSV data
        const csvData = await this.parseCSV(csvFile);
        
        // Use methods from calculations.js
        // needs to be edited 
        const metrics = calculateMetrics(csvData);
        const analysis = analyzeData(csvData);
        const report = generateReport(csvData, metrics, analysis);
        
        processedResults.push({
          filename: csvFile.name,
          data: csvData,
          metrics,
          analysis,
          report,
          processedAt: new Date().toISOString()
        });
      }

      return processedResults;
    } catch (error) {
      console.error('Error processing CSVs:', error);
      throw error;
    }
  }
}

const csvProcessor = new CSVProcessor();
export default csvProcessor;
export { CSVProcessor };