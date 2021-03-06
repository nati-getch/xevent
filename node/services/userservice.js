var express = require('express');
var mongoose = require('mongoose')

var url = "mongodb://root:123456@ds147864.mlab.com:47864/mwaproject";
mongoose.connect(url, {
    useMongoClient: true
})

let userSchema = new mongoose.Schema({
    userID: String,
    name: String,
    email: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: Number,
    },
    dob: Date,
    skill: String,
    education: String,
    bio: String,
    enabled: Number,
    role: Number
})

userSchema.statics.get = function (uid = null) {

    console.log("searching database: " + uid);
    return new Promise((resolve, reject) => {
        if (uid === null) {
            User.find({}, function (err, data) {
                if (err) reject(err);
                if (data)
                    resolve(JSON.stringify(data))
                else
                    resolve([]) // user not found, return empty array
            })
        } else {
            User.find({
                'userID': uid
            }, function (err, data) {
                if (err) reject(err)
                resolve(JSON.stringify(data))
            })
        }
    })
}

userSchema.statics.listUsers = function (pgStart = 0, perPage = 10) {
    console.log("searching user db starting from: " + pgStart + " & limit " + perPage);
    var perPage = parseInt(perPage);
    var pgStart = parseInt(pgStart);
    return new Promise((resolve, reject) => {
        User.find({})
            .limit(perPage)
            .skip(perPage * pgStart)
            .sort({
                userID: 'asc'
            })
            .exec((err, data) => {
                if (err) reject(err)
                if (data)
                    resolve(JSON.stringify(data))
                else
                    resolve([]) // user not found, return empty array
            });
    })
}

userSchema.methods.add = function () {
    return new Promise((resolve, reject) => {

        newUser = this;

        newUser.save(function (err) {
            if (err) {
                reject({
                    message: err,
                    status: 0
                })
            } else {
                console.log("user Added Successfully !");
                resolve({
                    message: "New User Added",
                    status: 1
                })
            }
        })
    })
}

userSchema.methods.update = function () {
    return new Promise((resolve, reject) => {
        //console.log('ZIPP'+User.);
        User.findOneAndUpdate({
            userID: this.userID
        }, {
            name: this.name,
            'address.street': this.address.street,
            'address.city': this.address.city,
            'address.state': this.address.state,
            'address.zipcode': this.address.zipcode,
            dob: new Date(this.dob),
            skill: this.skill,
            education: this.education,
            bio: this.bio,
        }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log('updated')
                resolve(data);
            }
        })
    })
}

userSchema.statics.changeRole = function (formData) {
    return new Promise((resolve, reject) => {
        // available date from Post targetUserId, targetRoleId
        console.log('formData.targetUserId.. '+ formData.targetUserId)
        const targetUserId = formData.targetUserId;
        const targetRoleId = parseInt(formData.targetRoleId);

        User.findOneAndUpdate({
            userID: targetUserId
        }, {
            role: targetRoleId
        }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log('user role updated')
                resolve(data);
            }
        })
    })
}

userSchema.statics.changeAccess = function (formData) {
    return new Promise((resolve, reject) => {
        // available date from Post targetUserId, accessId
        console.log('formData.targetUserId.. '+ formData.targetUserId)
        const targetUserId = formData.targetUserId;
        const accessId = parseInt(formData.accessId);

        User.findOneAndUpdate({
            userID: targetUserId
        }, {
            enabled: accessId
        }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log('user access level updated')
                resolve(data);
            }
        })
    })
}

userSchema.statics.isAdmin = function (uid) {
    console.log("check if user is admin: " + uid);
    return new Promise((resolve, reject) => {
        if (uid !== null) {
            User.findOne({
                'userID': uid,
                'role': '2'
            }, function (err, data) {
                if (err) reject(err);
                if (data)
                    resolve(true);
                else
                    resolve(false);
            })
        }
    })
};

let User = mongoose.model('User', userSchema);
module.exports = User;