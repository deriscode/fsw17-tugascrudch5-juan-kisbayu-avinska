const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.set("views", "./public/views");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

//Show welcome page
app.get("/", (req, res) => {
	res.render("welcome.ejs", {headTitle: "User List"})
})

//Read aka show data
app.get("/user", (req, res) => {
	const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
	res.render("main.ejs", { users: data, headTitle: "User List", bodyTitle: "User List" });
});

//Create new entry
app.get("/user/new", (req, res) => {
	res.render("new.ejs", { headTitle: "Add New User", bodyTitle: "Add New User" });
});

app.post("/user", async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPass = await bcrypt.hash(password, 10);
	const newUser = { id: uuid(), name, email, password: hashedPass };
	const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
	data.push(newUser);
	fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 4));
	res.redirect("/user");
});

//Update or edit data
app.get("/user/:id/edit", (req, res) => {
	const { id } = req.params;
	const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
	const foundUser = data.find((user) => user.id === id);
	res.render("edit.ejs", { user: foundUser, headTitle: "Edit User", bodyTitle: "Edit User" });
});

app.put("/user/:id", async (req, res) => {
	const { id } = req.params;
	const { name, email, password } = req.body;
	const hashedPass = await bcrypt.hash(password, 10);
	const editedUser = { id, name, email, password: hashedPass };
	const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
	const foundUserIndex = data.findIndex((user) => user.id === id);
	data[foundUserIndex] = editedUser;
	fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 4));
	res.redirect("/user");
});

//Delete Data
app.post("/user/:id/delete", (req, res) => {
	const { id } = req.params;
	const data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
	const deletedList = data.filter((i) => {
		return i.id != id;
	});

	fs.writeFileSync("./data/users.json", JSON.stringify(deletedList, null, 4));

	res.redirect("back");
});

//Port
const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
