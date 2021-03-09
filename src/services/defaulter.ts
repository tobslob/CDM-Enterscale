import { UserServ } from "@app/services/user";
import { DefaulterRepo } from "@app/data/defaulter";
import { Proxy, BVNResponse } from "@app/services/proxy";
import { responseHandler, ConstraintError, loopConcurrently } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Response } from "express";
import { Log } from "@app/common/services/logger";
import { UserRepo } from "@app/data/user";
import { RoleRepo } from "@app/data/role";

class DefaulterService {
  async createDefaulters(res: Response, workspace: string, defaulter: ExtractedDefaulter) {
    try {
      const verifiedUser: BVNResponse = await Proxy.verifyBVN(defaulter.BVN);
      Log.info(verifiedUser);

      if (defaulter.first_name !== verifiedUser.first_name && defaulter.last_name !== verifiedUser.last_name) {
        const defaulters = await DefaulterRepo.all({
          conditions: {
            request_token: defaulter.request_token
          }
        });

        loopConcurrently(defaulters, async (defaulter) => {
          await UserRepo.destroy({ id: defaulter.user });
          await RoleRepo.destroy({ id: defaulter.role_id });
        })

        await DefaulterRepo.bulkDelete(defaulter.request_token);
        throw new ConstraintError(`We could not validate the user ${defaulter.first_name} ${defaulter.last_name}`);
      }

      const user = await UserServ.createUser(workspace, {
        email_address: defaulter.email_address,
        first_name: defaulter.first_name,
        last_name: defaulter.last_name,
        phone_number: defaulter.phone_number,
        permissions: {
          loan_admin: false,
          super_admin: false,
          users: true
        }
      });

      return await DefaulterRepo.createDefaulters(workspace, user, defaulter);
    } catch (error) {
      return responseHandler(res, 400, error.message, null);
    }
  }
}

export const Defaulter = new DefaulterService();
