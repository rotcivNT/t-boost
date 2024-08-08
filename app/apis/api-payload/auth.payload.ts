export enum FindBy {
  CLERK_USER_ID = "clerkUserId",
  EMAIL = "email",
}
export interface GetUserPayload {
  field: string | string[];
  findBy: FindBy;
}
