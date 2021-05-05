import { bufferToStream } from "@app/data/util";
import { ConstraintError } from "@random-guys/siber";
import { Workbook } from "exceljs";
import { uniqBy } from "lodash";
import uuid from "uuid/v4";
// This is a hack to make Multer available in the Express namespace
//@ts-ignore
import { Multer } from "multer";
import { StatusType } from "@app/data/defaulter";
import { Gender } from "@app/data/user";

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const CSV_MIME = "text/csv";

export interface ExtractedDefaulter {
  title: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  DOB: Date;
  gender: Gender;
  location: string;
  loan_id: number;
  actual_disbursement_date: Date;
  is_first_loan: boolean;
  loan_amount: number;
  loan_tenure: number;
  days_in_default: number;
  amount_repaid: number;
  amount_outstanding: number;
  batch_id?: string;
  status: StatusType;
}

class ExtractionService {
  async extractDefaulters(file: Express.Multer.File): Promise<ExtractedDefaulter[]> {
    try {
      const rows = await this.loadSheetValues(file.mimetype, file.buffer);

      const EMAIL = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      let results = [];
      let batch_id = uuid();

      rows.forEach(row => {
        // ignore empty rows
        if (!row) return;

        // rows must all have 14 items
        if (Object.keys(row).length !== 14) return;

        // ignore headers
        if (!EMAIL.test(row[2]?.trim())) return;

        // remove any comma separated string
        row[1] = typeof row[1] === "string" ? row[1].replace(/\,/g, "") : row[1];
        row[6] = typeof row[6] === "string" ? row[7].replace(/\,/g, "") : row[6];
        row[7] = typeof row[7] === "string" ? row[7].replace(/\,/g, "") : row[7];

        row[4] = typeof row[4] === "string" ? new Date(row[4]) : row[4];
        row[5] = JSON.parse(row[5].toLowerCase().trim());
        row[6] = typeof row[6] === "string" ? Number(row[6]) : row[6];
        row[7] = typeof row[7] === "string" ? Number(row[7]) : row[7];
        row[8] = typeof row[8] === "string" ? Number(row[8]) : row[8];
        row[9] = typeof row[9] === "string" ? Number(row[9]) : row[9];
        row[10] = typeof row[10] === "string" ? Number(row[10]) : row[10];
        row[12] = typeof row[12] === "string" ? new Date(row[12]) : row[12];

        row[3] =
          typeof row[3] === "number" ? row[3].toString().padStart(14, "+234") : row[3]?.trim().padStart(14, "+234");

        results = uniqBy(results, result => {
          return `${result.phone_number}:${result.email_address}`;
        });

        const name = row[11]?.trim()?.split(" ");

        results.push({
          loan_id: row[1],
          email_address: row[2]?.trim(),
          phone_number: row[3],
          actual_disbursement_date: row[4],
          is_first_loan: row[5],
          loan_amount: row[6],
          loan_tenure: row[7],
          days_in_default: row[8],
          amount_repaid: row[9],
          amount_outstanding: row[10],
          first_name: name[0],
          last_name: name[1],
          DOB: row[12],
          gender: row[13]?.trim(),
          location: row[14],
          batch_id,
          status: "owning"
        });
      });

      if (results.length < 2) {
        throw new ConstraintError("The uploaded document has less than 2 valid defaulters");
      }

      return results;
    } catch (error) {
      throw new Error(error.message);
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
      case 11:
      case 12:
      case 13:
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
