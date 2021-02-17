import { WorkspaceRepo, WorkspaceDTO, Workspace } from "@app/data/workspace";
import { UserServ } from "./user";

class WorkspaceService {
  private workspace: Workspace;
  async createWorkspaceWithAdmin(dto: WorkspaceDTO) {
    this.workspace = await WorkspaceRepo.create({
      name: dto.name,
      address: dto.address,
      email_address: dto.workspace_email
    });

    await UserServ.createUser(this.workspace.id, {
      first_name: dto.first_name,
      last_name: dto.last_name,
      email_address: dto.email_address,
      phone_number: dto.phone_number,
      permissions: {
        loan_admin: dto.permissions.loan_admin,
        super_admin: dto.permissions.super_admin,
        users: dto.permissions.users
      }
    });

    return this.workspace;
  }
}

export const WorkspaceServ = new WorkspaceService();
