const socket = io();
let localStream;
let peerConnection;
let roomName;
let myName;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

async function init() {
  // clear video and chat on rejoin to avoid duplicates
  document.getElementById('videos').innerHTML = '';
  document.getElementById('messages').textContent = '';

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch (err) {
    alert('Camera and microphone access are required.');
    return;
  }

  const localVideo = document.createElement('video');
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.autoplay = true;
  document.getElementById('videos').append(localVideo);

  while (!roomName) {
    const input = (prompt('Enter a valid room name:') || '').trim();
    if (input) roomName = input;
  }
  while (!myName) {
    const input = (prompt('Enter your name:') || '').trim();
    if (input) myName = input;
  }

  // display room name in header
  document.getElementById('room-name').textContent = roomName;

  socket.emit('join', { room: roomName, name: myName });

  socket.off(); // remove previous handlers to prevent duplicates

  socket.on('room-full', () => {
    alert('This room is full.');
    roomName = null;
    init();
  });

  socket.on('user-connected', ({ name }) => {
    appendMessage(`${name} has entered ${roomName}`);
  });

  socket.on('ready', () => {
    setupPeer();
    createOffer();
  });

  socket.on('offer', async ({ offer }) => {
    setupPeer();
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', { answer, room: roomName });
  });

  socket.on('answer', async ({ answer }) => {
    await peerConnection.setRemoteDescription(answer);
  });

  socket.on('candidate', ({ candidate }) => {
    peerConnection.addIceCandidate(candidate);
  });

  socket.on('user-disconnected', ({ name }) => {
    appendMessage(`${name} has left ${roomName}`);
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
  });

  // Chat
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value.trim()) {
      socket.emit('message', { room: roomName, message: input.value });
      appendMessage(`You: ${input.value}`);
      input.value = '';
    }
  });
  socket.on('message', ({ name, message }) => {
    appendMessage(`${name}: ${message}`);
  });
}

function setupPeer() {
  peerConnection = new RTCPeerConnection(config);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', { candidate: event.candidate, room: roomName });
    }
  };
  peerConnection.ontrack = event => {
    // only add video elements for video tracks to avoid duplicates from audio tracks
    if (event.track.kind !== 'video') return;
    const video = document.createElement('video');
    video.srcObject = event.streams[0];
    video.autoplay = true;
    document.getElementById('videos').append(video);
  };
}

async function createOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { offer, room: roomName });
}

function appendMessage(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  const messages = document.getElementById('messages');
  messages.append(div);
  messages.scrollTop = messages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', init);