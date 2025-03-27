const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const app = express();
app.use(cors());
app.use(bodyParser.json());


const filePath = "C:\\Users\\Lyza\\Desktop\\Ngthino\\uc shiits\\testqua\\tesqua_proj-main\\user_data.csv";

// Ensure CSV has a header if file is new
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "UID,Username,Email,FirstName,LastName,Gender,Password\n");
}

app.post("/save-user", (req, res) => {
    const { username, email, firstname, lastname, gender, password } = req.body;

    if (!username || !email || !firstname || !lastname || !gender || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const uid = uuidv4(); // Generate unique ID
    const userData = `${uid},${username},${email},${firstname},${lastname},${gender},${password}\n`;

    fs.appendFile(filePath, userData, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error saving user" });
        }
        res.json({ message: "User saved successfully!", uid });
    });
});


// LOGIN Route: Authenticate User
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Both fields are required" });
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users = fileData.split("\n").slice(1); // Ignore header row

    for (const user of users) {
        const [uid, storedUsername, , , , , storedPassword] = user.split(",");
        if (storedUsername === username && storedPassword === password) {
            return res.json({ success: true, message: "Login successful!" });
        }
    }

    res.status(401).json({ success: false, message: "Invalid username or password" });
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));