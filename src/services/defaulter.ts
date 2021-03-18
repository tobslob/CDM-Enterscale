import { UserServ } from "@app/services/user";
import { DefaulterRepo } from "@app/data/defaulter";
import { Proxy } from "@app/services/proxy";
import { mapConcurrently } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Response } from "express";
import { Log } from "@app/common/services/logger";
import { UserRepo } from "@app/data/user";
import sha256 from "sha256";

class DefaulterService {
  async createDefaulters(res: Response, workspace: string, defaulter: ExtractedDefaulter) {
    const verifiedUser = await Proxy.verifyBVN(defaulter.BVN);
    Log.info(verifiedUser);

    let first_name = verifiedUser.first_name.toUpperCase();
    let last_name = verifiedUser.first_name.toUpperCase();

    if (defaulter.first_name !== first_name && defaulter.last_name !== last_name) {
      return;
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
  }

  async sha256Defaulter(workspace: string) {
    const defaulters = await DefaulterRepo.getDefaulters(workspace);

    return mapConcurrently(defaulters, async defaulter => {
      const user = await UserRepo.byID(defaulter.user);
      return {
        email: sha256(user.email_address.toLowerCase().trim()),
        first_name: sha256(user.first_name.toLowerCase().trim()),
        last_name: sha256(user.last_name.toLowerCase().trim()),
        phone_number: sha256(user.phone_number.toLowerCase().trim())
      };
    });
  }
}

export const Defaulter = new DefaulterService();
