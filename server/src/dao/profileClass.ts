import { db } from "src/database";

class Profile {
  userId: string;

  //getting all the user details
  async getUserDetails() {
    const userDetails = await db
      .selectFrom("users as u")
      .innerJoin("auth.users as au","u.auth_user_id","au.id")
      .selectAll()
      .where("auth_user_id", "=", this.userId)
      .execute();

    return userDetails;
  }


  constructor(userId: string) {
    this.userId = userId;
  }
}


export default Profile;