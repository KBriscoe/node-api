﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const sql = require('mssql/msnodesqlv8');

//Initiallising connection string

async function getUserFromProcedure(procedureName, username, password) {
    const conn = new sql.ConnectionPool({
        database:"IAT",
        server:"localhost",
        port:52202,
        driver:"msnodesqlv8",
        options: {
          trustedConnection: true
        }
    });
    await conn.connect().then(pool => {
        return pool.request()
        .input('pUsername', sql.NVarChar, username)
        .input('pPassword', sql.NVarChar, password)
        .output('User', sql.NVarChar)
        .output('responseMessage', sql.NVarChar)
        .execute(procedureName)
    }).then(result => {
        //console.dir(result)
        output = result.output
    }).catch(err => {
        //...error checking
        console.log(err)
    })

    return output
};

async function getUserListFromProcedure(procedureName, userGroup) {
    const conn = new sql.ConnectionPool({
        database:"IAT",
        server:"localhost",
        port:52202,
        driver:"msnodesqlv8",
        options: {
          trustedConnection: true
        }
    });
    await conn.connect().then(pool => {
        return pool.request()
        .input('pUserGroup', sql.NVarChar, userGroup)
        .output('UserList', sql.NVarChar)
        .output('responseMessage', sql.NVarChar)
        .execute(procedureName)
    }).then(result => {
        console.dir(result)
        output = result.output
    }).catch(err => {
        //...error checking
        console.log(err)
    })

    return output
}

async function getProjectListFromProcedure(procedureName, userID) {
    const conn = new sql.ConnectionPool({
        database:"IAT",
        server:"localhost",
        port:52202,
        driver:"msnodesqlv8",
        options: {
          trustedConnection: true
        }
    });
    await conn.connect().then(pool => {
        return pool.request()
        .input('puserID', sql.NVarChar, userID)
        .output('ProjectList', sql.NVarChar)
        .output('responseMessage', sql.NVarChar)
        .execute(procedureName)
    }).then(result => {
        console.dir(result)
        output = result.output
    }).catch(err => {
        //...error checking
        console.log(err)
    })

    return output
}

async function addProject(procedureName, title, description, rules, labels, users) {
    console.log(users)
    console.log()
    const conn = new sql.ConnectionPool({
        database:"IAT",
        server:"localhost",
        port:52202,
        driver:"msnodesqlv8",
        options: {
          trustedConnection: true
        }
    });
    await conn.connect().then(pool => {
        return pool.request()
        .input('pTitle', sql.NVarChar, title)
        .input('pDescription', sql.NVarChar, description)
        .input('pRules', sql.NVarChar, rules)
        .input('pLabels', sql.NVarChar, labels.toString())
        .input('pUsers', sql.NVarChar, users.toString())
        .output('responseMessage', sql.NVarChar)
        .execute(procedureName)
    }).then(result => {
        //console.dir(result)
        output = result.output
    }).catch(err => {
        //...error checking
        console.log(err)
    })

    return output
}

module.exports = {
    authenticate,
    createProject,
    getUserList,
    getProjectList,
    getAll
};

async function authenticate({ username, password }) {
    console.log("Attempting login with " + username)
    const user = await Promise.resolve(getUserFromProcedure('Login', username, password));
    if (user.User !== null) {
        userValues = JSON.parse(user.User)
        var Fname = userValues[0].FirstName
        if (userValues[0].Admin) {permissions = ['Administrator']}
        else{permissions = []}
        const token = jwt.sign({ sub: userValues[0].UserID, iss:'IAT', permissions:permissions }, config.secret);
        return { Fname, token };
    }
}

async function createProject({ title, description, rules, labels, users }) {
    console.log("Attempting create project: " + title)
    const result = await Promise.resolve(addProject('CreateProject', title, description, rules, labels, users));
    console.log(result.responseMessage)
    return result.responseMessage
}

async function getUserList(userGroup) {
    console.log("Retrieving User List: " + userGroup)
    const result = await Promise.resolve(getUserListFromProcedure('GetUserList', userGroup));
    console.log(result.responseMessage)
    return result.UserList
}

async function getProjectList(userToken) {
    try{
        var decoded = jwt.verify(userToken['userToken'], config.secret);
        console.log(decoded)
    }catch(err){
        return "Failed to authorize token"
    }
    console.log("Retrieving User Project List: " + decoded['sub'])
    const result = await Promise.resolve(getProjectListFromProcedure('GetProjectListForUser', decoded['sub']));
    console.log(result.responseMessage)
    return result.ProjectList
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
