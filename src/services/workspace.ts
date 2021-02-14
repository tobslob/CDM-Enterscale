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
      password: dto.password,
      email_address: dto.email_address,
      phone_number: dto.phone_number
    });

    return workspace;
  }
}

export const WorkspaceServ = new WorkspaceService();
