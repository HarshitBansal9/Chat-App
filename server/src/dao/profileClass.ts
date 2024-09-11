import { db } from "src/database";

class Profile {
  userId: string;

  //getting all the user details
  async getUserDetails(id = this.userId) {
    const userDetails = await db
      .selectFrom("users as u")
      .innerJoin("auth.users as au","u.auth_user_id","au.id")
      .selectAll()
      .where("auth_user_id", "=", id)
      .execute();

    return userDetails;
  }


  constructor(userId: string) {
    this.userId = userId;
  }
}


export default Profile;