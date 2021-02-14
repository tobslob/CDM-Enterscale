import { RoleRepo } from "@app/data/role/role.repo";

class RoleService {
  createDefaultRole(workspace: string) {
    return RoleRepo.createRole(workspace, {
      name: "Loan Administrator",
      permissions: {
        loan_administrator: true,
        super_administrator: false,
        users: false,
      },
      description: "Workspace loan administrator"
    });
  }
}

export const RoleServ = new RoleService();
