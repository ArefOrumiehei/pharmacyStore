// Account Requests Params
export interface IUpdateProfileParams {
  fullname: string;
  username: string;
  email?: string;
  profilePhoto?: File;
}

export interface ICompleteProfileParams {
  fullname: string;
  username: string;
  password: string;
  repassword: string;
  email?: string;
  profilePhoto?: File;
}

export interface IChangePasswordParams {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface ISetPasswordParams {
  password: string;
  rePassword: string;
}

export interface IChangeMobileRequestParams {
  mobile: string;
}

export interface IChangeMobileVerifyParams {
  mobile: string;
  code: string;
}

export interface IAddressFormParams {
  receiverFullName: string;
  receiverMobile: string;
  receiverAddress: string;
  receiverZipCode: string;
}

export interface IEditAddressFormParams extends IAddressFormParams {
  id: string;
}

export interface IRequestReturnParams {
  orderId: number;
  reason: string;
}