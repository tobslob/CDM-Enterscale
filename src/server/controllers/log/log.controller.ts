import { controller, request, response, httpGet, queryParam } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { EmailReports, EmailReportsQuery, EmailReportRepo } from "@app/data/email";
import { SMSReports, SMSReportQuery, SMSReportRepo } from "@app/data/sms";

type ControllerResponse = EmailReports | SMSReports | EmailReports[] | SMSReports[];

@controller("/logs")
export class ActionsController extends BaseController<ControllerResponse> {
  @httpGet("/sms", canCreateCampaign)
  async smsLogs(@request() req: Request, @response() res: Response, @queryParam() query: SMSReportQuery) {
    try {
      const workspace = req.session.workspace;
      const sms = await SMSReportRepo.searchSmsReports(workspace, query);

      this.handleSuccess(req, res, sms);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/email", canCreateCampaign)
  async emailLogs(@request() req: Request, @response() res: Response, @queryParam() query: EmailReportsQuery) {
    try {
      const workspace = req.session.workspace;
      const sms = await EmailReportRepo.searchEmailReports(workspace, query);

      this.handleSuccess(req, res, sms);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
