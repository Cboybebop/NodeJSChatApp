# Blue P2P Video Chat

An online peer‑to‑peer video and text‑chat application built with Node.js, Express and WebRTC. Featuring ephemeral chat, two‑person rooms, and a distinct blue‑toned interface.

---

## Features

* **Two‑way video chat**: Connect with a friend in a private room (max two participants).
* **Ephemeral text messaging**: Exchange messages during a session; chat history is not persisted.
* **Room management**:

  * Unique room names create or join on demand.
  * Capacity limit of two prevents overcrowding.
  * Rejoin after disconnection without loss of functionality.
* **Permissions prompt**: Requests camera and microphone access at load; shows an error alert if declined.
* **Room display**: Current room name is visible at the top of the chat panel.
* **Connection notifications**: Notifies when someone enters or leaves the room.

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v14 or later
* A modern browser with WebRTC support (e.g. Chrome, Firefox, Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Create a `.env` file** (optional):

   ```
   PORT=3000
   ```
4. **Start the server**

   ```bash
   npm start
   ```
5. **Open your browser** at `http://localhost:3000` and grant camera/microphone access.

---

## Usage

1. On load, grant permission to access camera and microphone.
2. Enter a valid room name and your display name when prompted.
3. Share the same room name with a friend to connect.
4. Use the chat panel to send text messages during the session.
5. To reconnect, simply reload the page and re‑enter the room name.

---

## Project Structure

```
├── server.js       # Express + Socket.io signalling server
├── public
│   ├── index.html  # Client markup
│   ├── style.css   # Blue‑themed stylesheet
│   └── client.js   # WebRTC and Socket.io client logic
├── .gitignore      # Files and directories to ignore in Git
├── README.md       # Project documentation (this file)
└── package.json    # Dependency and script definitions
```

---

## Licence

MIT Licence © 2025
