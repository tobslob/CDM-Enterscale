import { RoleRepo, Permissions } from "@app/data/role";

class RoleService {
  async createRole(workspace: string, permissions: Permissions) {
    let name: string, description: string;
    if (permissions.loan_admin) {
      (name = "Loan Administrator"), (description = "Workspace loan administrator");
    } else if (permissions.super_admin) {
      (name = "Super Administrator"), (description = "Enterscale administrator");
    } else if(permissions.engagement){
      (name = "engagement"), (description = "Role for list uploaded by users");
    } else {
      (name = "Acquisition"), (description = "Mooyi Uploaded list");
    }
    return await RoleRepo.createRole(workspace, {
      name,
      permissions,
      description
    });
  }
}

export const RoleServ = new RoleService();
