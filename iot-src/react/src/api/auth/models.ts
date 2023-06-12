export interface ILoginResponse {
  token: string;
  profile: IProfile;
  expiration: string;
}

export interface IProfile {
  username: string;
  name: string;
  surname: string;
  roleCode: string;
}
