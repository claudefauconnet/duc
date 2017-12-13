/**
 * Created by claud on 15/10/2017.
 */
var users = (function () {


    var self = {};
    var currentUserId;
    var dbName;
    self.listUsers = function () {
        dbName = $("#databaseSelect").val();


        var users = devisuProxy.loadData(dbName, "users", {});
        users.sort(function (a, b) {
            if (a.login > b.login)
                return 1;
            if (a.login < b.login)
                return -1;
            return 0;
        })
        var str = "<table>";
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            str += "<tr><td><button onclick='users.editUser(" + user.id + ")'>edit</button> </td><td>" + user.login + "</td><td>" + user.role + "</td></tr>"

        }
        str += "</table>"
        str += "<button onclick='users.editUser()'>Add</button>"
        $("#userDetailsDiv").html("");
        $("#usersListDiv").html(str);

    }

    self.editUser = function (id) {
        currentUserId = id;
        var user = {
            login: "",
            role: "read",
            password:""
        }
        if (id) {
            user = devisuProxy.loadData(dbName, "users", {id: id})[0];
        }

        if (user)
            var str = "<table>";
        str += "<tr><td> Login</td><td><input size='30' value='" + user.login + "' id='userLogin'></td></tr>"
                +"<tr><td> Password</td><td><input type='password' size='30' value='" + user.password + "' id='userPassword'></td></tr>"
            +"<tr><td> Role</td><td><select id='userRole'><option>admin</option><option>write</option><option>read</option></select></td></tr>"

        str += "</table>"
        str += "<button onclick='users.save(" + user.id + ")'>save</button>"
        str += "<button onclick='users.delete(" + user.id + ")'>delete</button>"
        $("#userDetailsDiv").html(str);
        $("#userRole").val(user.role);
    }

    self.save = function () {
        if (id) {
            var jsonData = {
                id: currentUserId,
                role: $("#userRole").val(),
                login: $("#userLogin").val(),
                password: $("#userPassword").val()
            }
            devisuProxy.updateItem(dbName, "users", jsonData, false);
        }
        else {
            var jsonData = {
                role: $("#userRole").val(),
                login: $("#userLogin").val(),
                password: $("#userPassword").val()
            }
            devisuProxy.addItem(dbName, "users", jsonData, false);
        }
        self.listUsers();

    }

    self.delete = function () {
        if (confirm("confirm delete user ?")) {
            devisuProxy.deleteItem(dbName, "users", currentUserId);
            self.listUsers();
        }

    }


    return self;
})
();