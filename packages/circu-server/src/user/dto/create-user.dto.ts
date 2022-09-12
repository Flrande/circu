import { IsAlphanumeric, IsByteLength, IsNotEmpty, IsString, Matches } from "class-validator"

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsByteLength(4, 20)
  username: string

  @IsNotEmpty()
  @IsString()
  @IsByteLength(1, 20)
  nickname: string

  /**
   * 密码要求:
   * 1. 至少8个字符
   * 2. 至少包含以下3类字符
   *  a. 英文大写字母
   *  b. 英文小写字母
   *  c. 数字0-9
   *  d. 非字母数字符号
   *  e. unicode 字符
   *
   * https://www.regextester.com/93998
   */
  @IsNotEmpty()
  @IsString()
  @Matches(
    new RegExp(
      /^(((?=.*\d)(?=.*[a-z])(?=.*[A-Z])){3}|((?=.*\d)(?=.*[a-z])(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])){3}|((?=.*\d)(?=.*[a-z])(?=.*[\u0080-\uffff])){3}|((?=.*\d)(?=.*[A-Z])(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])){3}|((?=.*\d)(?=.*[A-Z])(?=.*[\u0080-\uffff])){3}|((?=.*\d)(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])(?=.*[\u0080-\uffff])){3}|((?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])){3}|((?=.*[a-z])(?=.*[A-Z])(?=.*[\u0080-\uffff])){3}|((?=.*[a-z])(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])(?=.*[\u0080-\uffff])){3}|((?=.*[A-Z])(?=.*[!"#$%&'()*+, \-./:;<=>?@ [\\\]^_`}|}~])(?=.*[\u0080-\uffff])){3}).{8,}$/,
      "g"
    )
  )
  password: string
}
