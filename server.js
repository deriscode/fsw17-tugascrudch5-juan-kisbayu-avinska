const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./public/views");
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.render("main", {});
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
