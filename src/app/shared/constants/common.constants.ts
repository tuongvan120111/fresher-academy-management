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

export const CountryAllowed = ["NZ", "UY", "KH", "MV", "ES", "TR", "EG", "VN", "NG", "MY", "SG", "AO", "AU", "IS", "CA", "RU", "UZ", "UA", "IT", "CG", "TW", "ZW", "FR", "MK", "JP", "CN", "HK", "PH", "ID", "AF", "US",]
