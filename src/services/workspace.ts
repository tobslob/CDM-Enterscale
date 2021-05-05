import { WorkspaceRepo, WorkspaceDTO } from "@app/data/workspace";
import { UserServ } from "./user";

class WorkspaceService {
  async createWorkspaceWithAdmin(dto: WorkspaceDTO) {
    const workspace = await WorkspaceRepo.create({
      name: dto.name,
      address: dto.address,
      email_address: dto.workspace_email
    });

    await UserServ.createUser(workspace.id, {
      first_name: dto.first_name,
      last_name: dto.last_name,
      email_address: dto.email_address,
      phone_number: dto.phone_number,
      DOB: dto.DOB,
      gender: dto.gender,
      location: dto.location,
      permissions: {
        loan_admin: true,
        super_admin: false,
        users: false
      }
    });

    return workspace;
  }
}

export const WorkspaceServ = new WorkspaceService();
