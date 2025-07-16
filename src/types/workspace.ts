export interface Workspace {
  workspaceId: string;
  tag: string;
  name: string;
  imageId?: string;
} 

export interface Workspaces {
  workspaces: Workspace[];
}