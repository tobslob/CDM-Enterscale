import { controller, request, response, httpGet, queryParam } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { canCreateCampaign } from "../campaign/campaign.middleware";
import { EmailReports, EmailReportsQuery, EmailReportRepo } from "@app/data/email-report";
import { SMSReports, SMSReportQuery, SMSReportRepo } from "@app/data/sms";
import { Mail } from "@app/data/email/email.repo";

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

      const trackers = await Mail.all({
        conditions: {
          workspace
        }
      });

      const message_ids: string[] = [];

      trackers.forEach(t => {
        message_ids.push(t.message_id);
      });

      const email = await EmailReportRepo.searchEmailReports(message_ids, query);

      this.handleSuccess(req, res, email);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
