export interface UserInfo {
  userId: number;
  nickname: string;
  avatar: string;
  roles: string[];
  perms: string[];
}

/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  account: string;
  /**
   * 密码
   */
  passWord: string;

  /**
   * 验证码缓存key
   */
  captchaId?: string;

  /**
   * 验证码
   */
  verifyCode?: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  token?: string;
}

/**
 * 用户头像
 */
export interface LoginInfo {
  avatar: string;
  username: string;
}

/**
 * 用户权限
 */
export interface Permmenu {
  menus: any[];
  perms: string[];
}

/**
 * 验证码响应
 */
export interface CaptchaResult {
  /**
   * 验证码缓存key
   */
  captchaId: string;
  /**
   * 验证码图片Base64字符串
   */
  verifyCode: string;
}
