import { bufferToStream } from "@app/data/util";
import { ConstraintError } from "@random-guys/siber";
import { Workbook } from "exceljs";
import { uniqBy } from "lodash";
import uuid from "uuid/v4";
// This is a hack to make Multer available in the Express namespace
//@ts-ignore
import { Multer } from "multer";

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const CSV_MIME = "text/csv";

export interface ExtractedDefaulter {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  total_loan_amount: number;
  loan_outstanding_balance: number;
  loan_tenure: number;
  time_since_default: number;
  time_since_last_payment: number;
  last_contacted_date: Date;
  BVN: string;
  request_token: string;
}

class ExtractionService {
  async extractDefaulters(file: Express.Multer.File): Promise<ExtractedDefaulter[]> {
    try {
      const rows = await this.loadSheetValues(file.mimetype, file.buffer);

      const BVN = /^\d{1,11}$/;
      const EMAIL = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      let results = [];

      const request_token = uuid()

      rows.forEach(row => {
        // ignore empty rows
        if (!row) return;

        // rows must all have 12 items
        if (Object.keys(row).length !== 11) return;

        // ignore headers
        if (!EMAIL.test(row[3])) return;

        row[4] = typeof row[4] === "number" ? row[4].toString() : row[4].trim();
        row[5] = typeof row[5] === "string" ? Number(row[5]) : row[5];
        row[6] = typeof row[6] === "string" ? Number(row[6]) : row[6];
        row[7] = typeof row[7] === "string" ? Number(row[7]) : row[7];
        row[8] = typeof row[8] === "string" ? Number(row[8]) : row[8];
        row[9] = typeof row[9] === "string" ? Number(row[9]) : row[9];
        row[10] = typeof row[10] === "string" ? new Date(row[10]) : row[10];

        if (row[11]) {
          if (!BVN.test(row[11])) return;
        }

        row[4] = row[4].padStart(15, "+234")


        results = uniqBy(results, result => {
          return `${result.phone_number}:${result.BVN}`;
        });

        results.push({
          first_name: row[1],
          last_name: row[2],
          email_address: row[3],
          phone_number: row[4],
          total_loan_amount: row[5],
          loan_outstanding_balance: row[6],
          loan_tenure: row[7],
          time_since_default: row[8],
          time_since_last_payment: row[9],
          last_contacted_date: row[10],
          BVN: row[11],
          request_token
        });
      });

      if (results.length < 2) {
        throw new ConstraintError("The uploaded document has less than 2 valid defaulters");
      }

      return results;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  private parseCSVRow(value: string, index: number) {
    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return value;
    }
  }

  async loadSheetValues(mime: string, buffer: Buffer) {
    const workbook = new Workbook();

    if (mime === XLSX_MIME) {
      await workbook.xlsx.load(buffer);
      return workbook.getWorksheet(1).getSheetValues();
    } else if (mime === CSV_MIME) {
      const sheet = await workbook.csv.read(bufferToStream(buffer), {
        map: this.parseCSVRow
      });
      return sheet.getSheetValues();
    } else {
      throw new ConstraintError("Only CSV and XLSX files are supported for extractions");
    }
  }
}

export const Extractions = new ExtractionService();
