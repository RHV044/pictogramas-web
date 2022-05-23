export interface IPictogram {
  id: number;
  blob: Blob;
  description: string;
  tags: string[];
  schematic: boolean;
  sex: boolean;
  violence: boolean;
  aac: boolean;
  aacColor: boolean;
  skin: boolean;
  hair: boolean;
}
