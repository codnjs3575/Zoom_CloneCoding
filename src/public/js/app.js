const messageList = document.querySelector('ul')
const messageForm = document.querySelector('#message')
const nicknameForm = document.querySelector('#nick')

// const socket = new WebSocket('ws://localhost:3000')
// 해당 socket을 가지고 backend와 실시간으로 소통할 수 있음
// app.js에서의 socket -> 서버로의 연결을 뜻함
const socket = new WebSocket(`ws://${window.location.host}`)

function makeMessage(type, payload) {
  const msg = { type, payload }
  return JSON.stringify(msg)
}

// 서버 on
socket.addEventListener('open', () => console.log('connected to Server!'))
// 서버 off
socket.addEventListener('close', () => console.log('Disconnected from server!'))

// 메세지 받으면
socket.addEventListener('message', (message) => {
  const li = document.createElement('li')
  li.innerText = message.data
  messageList.append(li)
})

// messageForm
function handleSubmit(event) {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  socket.send(makeMessage('new_message', input.value))

  // 내가 보낸 메세지 보여주기
  const li = document.createElement('li')
  li.innerText = `You : ${input.value}`
  messageList.append(li)
  input.value = ''
}
messageForm.addEventListener('submit', handleSubmit)

// nicknameForm
function handleNickSubmit(event) {
  event.preventDefault()
  const input = nicknameForm.querySelector('input')
  socket.send(makeMessage('nickname', input.value))
}
nicknameForm.addEventListener('submit', handleNickSubmit)
