export interface UserGooglePayload {
  firstName: string;
  lastName: string;
  profilePicture: string;
  account: {
    email: string;
    userName: string;
  };
}
