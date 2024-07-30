"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("src/database");
class Friend {
    userId;
    //Getting all current members
    async getFriends() {
        try {
            const members = await database_1.db
                .selectFrom("users")
                .selectAll()
                .where("auth_user_id", "!=", this.userId)
                .execute();
            return members;
        }
        catch (error) {
            return error;
        }
    }
    //Getting the users requests
    async getUsersRequests() {
        try {
            const requests = await database_1.db
                .selectFrom("friends")
                .selectAll()
                .where("friends.user2_id", "=", this.userId)
                .where("accepted", "=", false)
                .execute();
            return requests;
        }
        catch (error) {
            return error;
        }
    }
    //Removing a friend
    async removeFriend(friendID) {
        try {
            await database_1.db
                .deleteFrom("friends")
                .where((eb) => eb.or([
                eb("user1_id", "=", this.userId).and("user2_id", "=", friendID),
                eb("user1_id", "=", friendID).and("user2_id", "=", this.userId),
            ]))
                .where("accepted", "=", true)
                .execute();
            return;
        }
        catch (error) {
            return error;
        }
    }
    //Sending a friend request
    async sendFriendRequest(friendId) {
        try {
            await database_1.db
                .insertInto("friends")
                .columns(["user1_id", "user2_id", "accepted"])
                .values([this.userId, friendId, false])
                .execute();
            return;
        }
        catch (error) {
            return error;
        }
    }
    //Cancelling a friend request
    async cancelFriendRequest(friendId) {
        try {
            await database_1.db
                .deleteFrom("friends")
                .where("user1_id", "=", this.userId)
                .where("user2_id", "=", friendId)
                .where("accepted", "=", false)
                .execute();
            return;
        }
        catch (error) {
            return error;
        }
    }
    //Handling request response
    async handleRequestResponse(friendId, response) {
        try {
            if (response === "accept") {
                await database_1.db
                    .updateTable("friends")
                    .set("accepted", true)
                    .where("user1_id", "=", friendId)
                    .where("user2_id", "=", this.userId)
                    .execute();
            }
            else {
                await database_1.db
                    .deleteFrom("friends")
                    .where("user1_id", "=", friendId)
                    .where("user2_id", "=", this.userId)
                    .where("accepted", "=", false)
                    .execute();
            }
            return;
        }
        catch (error) {
            return error;
        }
    }
    //Getting all user details
    async getUserDetails() {
        try {
            const [allMembers, receivedRequests, allFriends, sentRequests] = await Promise.all([
                //get members
                database_1.db
                    .selectFrom("users as u")
                    .selectAll()
                    .where("u.auth_user_id", "!=", this.userId)
                    .where("u.auth_user_id", "not in", database_1.db
                    .selectFrom("friends as f")
                    .select("f.user2_id")
                    .where("f.user1_id", "=", this.userId))
                    .where("u.auth_user_id", "not in", database_1.db
                    .selectFrom("friends as f")
                    .select("f.user1_id")
                    .where("f.user2_id", "=", this.userId))
                    .execute(),
                //get received requests
                database_1.db
                    .selectFrom("users as u")
                    .innerJoin("friends as f", "u.auth_user_id", "f.user1_id")
                    .selectAll()
                    .where("f.user2_id", "=", this.userId)
                    .where("f.accepted", "=", false)
                    .execute(),
                //get all friends
                database_1.db
                    .selectFrom(["users as u", "friends as f"])
                    .where((eb) => eb.or([
                    eb("u.auth_user_id", "=", "f.user1_id")
                        .and("f.user2_id", "=", this.userId)
                        .and("f.accepted", "=", true),
                    eb("u.auth_user_id", "=", "f.user2_id")
                        .and("f.user1_id", "=", this.userId)
                        .and("f.accepted", "=", true),
                ]))
                    .execute(),
                //get sent requests
                database_1.db
                    .selectFrom("friends as f")
                    .selectAll()
                    .innerJoin("users as u", "f.user2_id", "u.auth_user_id")
                    .where("f.user1_id", "=", this.userId)
                    .where("f.accepted", "=", false)
                    .execute(),
            ]);
        }
        catch (error) {
            return error;
        }
    }
    constructor(userID) {
        this.userId = userID;
    }
}
