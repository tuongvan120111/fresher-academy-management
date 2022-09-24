export enum RoleUser {
  Unknow = 0,
  FAManager,
  DeliveryManager,
  ClassAdmin,
  FARec,
  Trainer,
  SystemAdmin,
  Trainee
}

export const RoleUserString = {
  FAManager: 'FA Manager',
  DeliveryManager: 'DeliveryManager',
  ClassAdmin: 'ClassAdmin',
  FARec: 'FARec',
  Trainer: 'Trainer',
  SystemAdmin: 'SystemAdmin'
}

export const ListRoleuser = [
  RoleUser.FAManager,
  RoleUser.DeliveryManager,
  RoleUser.ClassAdmin,
  RoleUser.FARec,
  RoleUser.Trainer,
  RoleUser.SystemAdmin,
  RoleUser.Trainee
]

export const Loclastorage = {
  UserLogin: 'user.login'
}
