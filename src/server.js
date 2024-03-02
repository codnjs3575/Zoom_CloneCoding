import express from 'express'
import http from 'http'
import WebSocket from 'ws'

const app = express()

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use('/public', express.static(__dirname + '/public'))
app.get('/', (req, res) => res.render('home'))
app.get('/*', (_, res) => res.redirect('/'))

const handleListen = () => console.log(`Listening on http://localhost:3000`)

// http 서버 생성하기
const server = http.createServer(app)

// ws 서버 생성하기
const wss = new WebSocket.Server({ server })

// fake database 만들기
const sockets = []

wss.on('connection', (socket) => {
  sockets.push(socket)
  socket['nickname'] = 'Anon'

  console.log(sockets.length)
  // socket에 있는 메서드를 이용하여 브라우저에 메세지 전달하기
  console.log('connected to Browser!')
  socket.on('close', () => console.log('Disconnected from Browser!'))

  socket.on('message', (msg) => {
    // message = message.toString('utf8')
    const message = JSON.parse(msg)
    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        )
      case 'nickname':
        socket['nickname'] = message.payload
    }
  })
})

// localhost는 동일한 포트에서 http, ws 두 개를 다 처리할 수 있게 됨
server.listen(3000, handleListen())
