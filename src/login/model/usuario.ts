export interface IUsuario {
  id: number;
  username: string;
  password: string;
  children?: JSX.Element|JSX.Element[];
}