module.exports = class User {
    /**
     * 
     * @param {IUser} userOptions 
     */
    constructor(userOptions) {
        this.name = userOptions.name;
        this.lastname = userOptions.lastname;
        this.email = userOptions.email;
        this.dateCreated = userOptions.dateCreated;
        this.password = userOptions.password;
        this.document = userOptions.document;
    }
}