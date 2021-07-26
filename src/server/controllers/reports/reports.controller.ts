import "reflect-metadata";
import { Request, Response } from "express";
import { controller, request, response, httpGet, queryParam } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import { SMSReports } from "@app/data/sms";
import { EmailReports } from "@app/data/email-report";
import { Voice } from "@app/data/voice";
import { ReportsQuery, Reports } from "@app/services/reports";

type controllerReponse = SMSReports | EmailReports | Voice | object;

@controller("/reports")
export class ReportController extends BaseController<controllerReponse> {
  @httpGet("/", canCreateDefaulters)
  async getReportByCampaign(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: ReportsQuery
  ) {
    try {
      const reports = await Reports.getReport(req.session.workspace, query);
      this.handleSuccess(req, res, reports);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
