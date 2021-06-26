import { ConstraintError } from "@random-guys/siber";
import { Workbook } from "exceljs";
import { uniqBy } from "lodash";

export const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const CSV_MIME = "text/csv";

export interface ExtractedUsers {
  email_address: string;
  name: string;
  date: Date;
}

class UserExtractionService {
  async extractUsers(fileString: string): Promise<ExtractedUsers[]> {
    try {
      const rows = await this.getCSV(fileString);

      const EMAIL = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      let results = [];

      rows.forEach(row => {
        // ignore empty rows
        if (!row) return;

        // rows must all have 14 items
        if (Object.keys(row).length !== 3) return;

        // ignore headers
        if (!EMAIL.test(row[1]?.trim())) return;

        // remove any comma separated string
        row[1] = row[1].toString().toLowerCase();
        row[2] = row[2].toString().toLowerCase();
        row[3] = typeof row[3] === "string" ? new Date(row[3]) : row[3];

        results = uniqBy(results, (result: ExtractedUsers) => result.email_address);

        results.push({
          email_address: row[1]?.trim(),
          name: row[2].trim(),
          DOB: row[3].trim(),
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

  private async getCSV(file: string) {
    const workbook = new Workbook();
    const sheet = await workbook.csv.readFile(`./sheets/sources/${file}.csv`, {
      map: val => val,
      parserOptions: { trim: true }
    });

    return sheet.getSheetValues();
  }
}

export const Extractions = new UserExtractionService();
