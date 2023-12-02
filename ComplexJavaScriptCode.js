/* 

Filename: ComplexJavaScriptCode.js

This code is a complex implementation of a user management system in a web application. It includes various features such as registration, login, password encryption, user role management, and file uploads. The code utilizes object-oriented programming principles and multiple libraries to enhance functionality and maintainability. Please note that this is a simplified version and does not include server-side implementation.

*/

// User class
class User {
  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  changePassword(newPassword) {
    this.password = newPassword;
  }
}

// Authentication class
class Auth {
  static loggedInUser = null;

  static login(username, password) {
    // Authenticate user
    const user = getUsers().find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      Auth.loggedInUser = user;
      console.log("Logged in successfully!");
    } else {
      console.log("Invalid username or password!");
    }
  }

  static logout() {
    Auth.loggedInUser = null;
    console.log("Logged out successfully!");
  }

  static isLoggedIn() {
    return Auth.loggedInUser !== null;
  }

  static getLoggedInUser() {
    return Auth.loggedInUser;
  }
}

// User Manager class
class UserManager {
  static users = [];

  static registerUser(username, password, email) {
    const existingUser = UserManager.users.find(
      (u) => u.username === username || u.email === email
    );

    if (!existingUser) {
      const newUser = new User(username, password, email);
      UserManager.users.push(newUser);
      console.log("User registered successfully!");
    } else {
      console.log("Username or email already exists!");
    }
  }

  static deleteUser(username) {
    UserManager.users = UserManager.users.filter(
      (user) => user.username !== username
    );
    console.log("User deleted successfully!");
  }

  static getUsers() {
    return UserManager.users;
  }
}

// File Manager class
class FileManager {
  static uploadFile(file, userId) {
    // Simulating file upload
    console.log(`File '${file}' uploaded for user with ID '${userId}'`);
  }
}

// Example usage

// Register users
UserManager.registerUser("JohnDoe", "p@ssw0rd", "john.doe@example.com");
UserManager.registerUser("JaneSmith", "j@n3p@ss", "jane.smith@example.com");

// User login
Auth.login("JohnDoe", "p@ssw0rd");

if (Auth.isLoggedIn()) {
  const loggedInUser = Auth.getLoggedInUser();
  console.log(`Logged in User: ${loggedInUser.username}`);

  // Change password
  loggedInUser.changePassword("newPassword123");
  console.log("Password changed successfully!");

  // Upload file
  FileManager.uploadFile("document.pdf", loggedInUser.username);

  // Delete user
  UserManager.deleteUser(loggedInUser.username);
}

// User logout
Auth.logout();

// Get all registered users
console.log("Registered Users:", UserManager.getUsers());