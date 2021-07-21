import { Model } from "@random-guys/bucket";

export interface Template extends Model{
  name: string;
  identifier: string;
}

export interface TemplateDTO {
  name: string;
  identifier: string;
}

export interface TemplateVars<U = any> {
  workspace?: string;
  salutation?: string;
  first_name?: string;
  email_address?: string;
  message?: string;
  amount?: string;
  vars?: U;
}
