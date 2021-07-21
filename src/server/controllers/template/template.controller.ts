import { controller, httpPost, request, response, requestBody, httpGet, requestParam } from "inversify-express-utils";
import { BaseController } from "@app/data/util";
import { Request, Response } from "express";
import { TemplateDTO, Template, TemplateRepo } from "@app/data/templates";

type ControllerResponse = Template | Template[];

@controller("/templates")
export class TemplateController extends BaseController<ControllerResponse> {
  @httpPost("/")
  async createTemplate(@request() req: Request, @response() res: Response, @requestBody() body: TemplateDTO) {
    try {
      const emailTemplate = await TemplateRepo.createTemplate(body);
      this.handleSuccess(req, res, emailTemplate);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/id")
  async getTemplate(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    try {
      const emailTemplate = await TemplateRepo.getTemplate(id);
      this.handleSuccess(req, res, emailTemplate);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/id")
  async getAllTemplates(@request() req: Request, @response() res: Response) {
    try {
      const emailTemplates = await TemplateRepo.getAllTemplate();
      this.handleSuccess(req, res, emailTemplates);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
