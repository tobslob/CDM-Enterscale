import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestParam,
  queryParam,
  httpDelete,
  httpPatch,
  requestBody
} from "inversify-express-utils";
import { BaseController, validate, loopConcurrently, ConstraintError } from "@app/data/util";
import { isUpload, canCreateDefaulters } from "./defaulter.middleware";
import { Extractions, ExtractedResponse } from "@app/services/extraction";
import { Request, Response } from "express";
import { DefaulterRepo, Defaulter, DefaulterQuery, DefaulterDTO } from "@app/data/defaulter";
import { isDefaulterDTO } from "./defaulter.validator";
import { BodyCampaignType, CampaignType } from "@app/data/campaign";
import { UserServ } from "@app/services/user";
import { RoleServ } from "@app/services/role";

type ControllerResponse = Defaulter[] | Defaulter | ExtractedResponse;

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", isUpload)
  async extractUsers(@request() req: Request, @response() res: Response, @requestBody() body: BodyCampaignType) {
    try {
      if (!body.campaign_type) {
        throw new ConstraintError("campaign_type is required");
      }
      const workspace = "4dd3a5da-3bad-4a87-9526-6f20351b4492";

      if(!req.file) {
        throw new ConstraintError("A valid file is required");
      }
      
      const uploadedList = await Extractions.extractUsers(req.file);

      if(body.campaign_type == "standard") {
        uploadedList.results.forEach(res => {
          res["status"] = "owing"
        })
      }

      const defaulterList = await DefaulterRepo.createDefaulter(req, workspace, {
        users: uploadedList.results,
        batch_id: uploadedList.batch_id,
        upload_type: body.campaign_type
      });

      if (body.campaign_type === CampaignType.STANDARD) {
        const role = await RoleServ.createRole(workspace, {
          standard: true
        });
        await loopConcurrently(defaulterList.users, async user => {
          user["role_id"] = role.id;
          await UserServ.createUser(workspace, user);
        });
      }

      this.handleSuccess(req, res, uploadedList);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateDefaulters)
  async getAllDefaultUsers(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const workspace = req.session.workspace;
      const defaulterLists = await DefaulterRepo.getDefaulters(workspace, query);

      this.handleSuccess(req, res, defaulterLists);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateDefaulters)
  async getDefaultUser(@request() req: Request, @response() res: Response, @requestParam("id") _id: string) {
    try {
      const workspace = req.session.workspace;
      const defaulter = await DefaulterRepo.byQuery({ workspace, _id });

      this.handleSuccess(req, res, defaulter);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/", canCreateDefaulters)
  async deleteDefaultFile(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const workspace = req.session.workspace;
      await DefaulterRepo.deleteDefaulterList(query, workspace);

      this.handleSuccess(req, res, null);

      this.log(req, {
        object_id: query.batch_id,
        activity: "delete.defaulters",
        message: `delete defaulters`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch("/:id", canCreateDefaulters, validate(isDefaulterDTO, "body"))
  async editDefaulter(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @requestBody() body: DefaulterDTO
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulter = await DefaulterRepo.editDefulter(workspace, id, body);

      this.handleSuccess(req, res, defaulter);

      this.log(req, {
        object_id: defaulter.id,
        activity: "delete.defaulter",
        message: `delete defaulter`
      });
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
