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
