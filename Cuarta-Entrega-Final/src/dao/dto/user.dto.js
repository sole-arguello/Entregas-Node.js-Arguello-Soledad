export class UsersDto {
    constructor(userInfo) {
        this.full_name = `${userInfo.first_name} ${userInfo.last_name}`.toUpperCase();
        this.email = userInfo.email,
        this.age = userInfo.age,
        this.role = userInfo.role,
        this.cart = userInfo.cart;
    }
  }