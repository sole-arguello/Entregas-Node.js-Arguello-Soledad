export class UsersDto {
    constructor(userInfo) {
        this.full_name = `${userInfo.first_name} ${userInfo.last_name}`.toUpperCase();
        (this.first_name = userInfo.first_name),
        (this.last_name = userInfo.last_name),
        (this.email = userInfo.email),
        (this.age = userInfo.age),
        (this.role = userInfo.role),
        (this.cart = userInfo.cart);
    }
  }