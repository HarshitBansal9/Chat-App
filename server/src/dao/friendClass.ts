import { db } from "src/database";
import pool from "src/db";

class Friend {
  userId: string;

  //Removing a friend
  async removeFriend(friendID: string) {
    try {
      await db
        .deleteFrom("friends")
        .where((eb) =>
          eb.or([
            eb("user1_id", "=", this.userId).and("user2_id", "=", friendID),
            eb("user1_id", "=", friendID).and("user2_id", "=", this.userId),
          ])
        )
        .where("accepted", "=", true)
        .execute();

      return;
    } catch (error) {
      return error;
    }
  }

  //Sending a friend request
  async sendFriendRequest(friendId: string) {
    try {
      await db
        .insertInto("friends")
        //.columns(["user1_id", "user2_id", "accepted"])
        .values({ user1_id: this.userId, user2_id: friendId, accepted: false })
        .execute();

      return;
    } catch (error) {
      return error;
    }
  }

  //Cancelling a friend request
  async cancelFriendRequest(friendId: string) {
    try {
      await db
        .deleteFrom("friends")
        .where("user1_id", "=", this.userId)
        .where("user2_id", "=", friendId)
        .where("accepted", "=", false)
        .execute();

      return;
    } catch (error) {
      return error;
    }
  }

  //Handling request response
  async handleRequestResponse(friendId: string, response: string) {
    try {
      if (response === "accept") {
        await db
          .updateTable("friends")
          .set("accepted", true)
          .where("user1_id", "=", friendId)
          .where("user2_id", "=", this.userId)
          .execute();
      } else {
        await db
          .deleteFrom("friends")
          .where("user1_id", "=", friendId)
          .where("user2_id", "=", this.userId)
          .where("accepted", "=", false)
          .execute();
      }

      return;
    } catch (error) {
      return error;
    }
  }

  //Getting all user details
  async getUserDetails(id = this.userId) {
    console.log("User ID", id);
    try {
      const [allMembers, receivedRequests, allFriends1,allFriends2, sentRequests] =
        await Promise.all([
          //get members
          db
            .selectFrom("users as u")
            .selectAll()
            .where("u.auth_user_id", "!=", id)
            .execute(),
          //get received requests
          db
            .selectFrom("users as u")
            .selectAll()
            .innerJoin("friends as f", "u.auth_user_id", "f.user1_id")
            .where("f.user2_id", "=", id)
            .where("f.accepted", "=", false)
            .execute(),

          //get all friends
          db
            .selectFrom("users as u")
            .innerJoin("friends as f", "u.auth_user_id", "f.user2_id")
            .selectAll()
            .where("f.user1_id", "=", id)
            .where("f.accepted", "=", true)
            .execute(),

          db
            .selectFrom("users as u")
            .innerJoin("friends as f", "u.auth_user_id", "f.user1_id")
            .selectAll()
            .where("f.user2_id", "=", id)
            .where("f.accepted", "=", true)
            .execute(),
            
          //get sent requests
          db
            .selectFrom("friends as f")
            .selectAll()
            .innerJoin("users as u", "f.user2_id", "u.auth_user_id")
            .where("f.user1_id", "=", id)
            .where("f.accepted", "=", false)
            .execute(),
        ]);
      const details = {
        allMembers: allMembers,
        allRequests: receivedRequests,
        allFriends: allFriends1.concat(allFriends2),
        sentRequests: sentRequests,
      };
      return details;
    } catch (error) {
      return error;
    }
  }

  constructor(userID: string) {
    this.userId = userID;
  }
}

export default Friend;
