"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("src/database");
class Profile {
    userId;
    //getting all the user details
    async getUserDetails() {
        const userDetails = await database_1.db
            .selectFrom("users as u")
            .innerJoin("auth.users as au", "u.auth_user_id", "au.id")
            .selectAll()
            .where("auth_user_id", "=", this.userId)
            .execute();
        return userDetails;
    }
    constructor(userId) {
        this.userId = userId;
    }
}
exports.default = Profile;
