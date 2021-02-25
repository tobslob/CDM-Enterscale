import { RoleRepo } from "@app/data/role";

class RoleService {
  async createRole(workspace: string, loan_admin?: boolean, super_admin?: boolean, users?: boolean) {
    let name: string, description: string;
    if (loan_admin) {
      (name = "Loan Administrator"), (description = "Workspace loan administrator");
    } else if (super_admin) {
      (name = "Super Administrator"), (description = "Enterscale administrator");
    } else {
      (name = "Platform user"), (description = "platform users");
    }
    return await RoleRepo.createRole(workspace, {
      name,
      permissions: {
        loan_admin,
        super_admin,
        users
      },
      description
    });
  }
}

export const RoleServ = new RoleService();
