export interface CreateElement {
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  isDeleted: boolean
}

export interface UpdateElement {
  updatedDate: string;
  updatedBy: string;
}

export interface DeletedElement extends UpdateElement {
  isDeleted: boolean
}

export interface SelectedItem {
  id: string;
  name: string;
  isDisable: boolean
}

export interface Authentications {
  id?: string;
  userName?: string;
  passWd?: string | Int32Array | undefined;
  role: number;
  isLogged: boolean;
  buzUnit: string;
  fullName: string;
}

export interface LoginInfor {
  isLogged: boolean;
  fullName: string;
  buzUnit: string;
}

export interface DialogCommonData {
  icon: string[];
  title: string;
  message: string;
  buttons: string;
  isOneButton?: boolean;
}