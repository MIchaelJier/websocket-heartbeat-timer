// 原生node实现
const http = require('http');
const net = require('net');//TCP 原生socket
const crypto = require('crypto');
const {decodeDataFrame, encodeWsFrame, getNowTime} = require('./utils')

let server = net.createServer(socket => {

    //握手只有一次
    socket.once('data',(data)=>{
        console.log('握手开始')
        let str = data.toString()
        let lines = str.split('\r\n')

        //舍弃第一行和最后两行
        lines = lines.slice(1,lines.length-2)

        //切开
        let headers ={}
        lines.forEach(line => {
           let [key,value]= line.split(`: `)

            headers[key.toLowerCase()]=value

        })

        if(headers[`upgrade`]!='websocket'){
            console.log('其他协议',headers[`upgrade`])
            socket.end()
        }else if(headers[`sec-websocket-version`] != '13'){
            console.log('版本不对',headers[`upgrade`])
            socket.end()
        }else {
            let key  = headers['sec-websocket-key']
            let mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

            let hash =crypto.createHash('sha1')
            hash.update(key+mask)
            let key2 =hash.digest('base64')

            socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${key2}\r\n\r\n`)
            //服务器响应,握手结束
            //真正的数据
          
            socket.on('data',data1 => { 
                socket.write(encodeWsFrame({
                    payloadData: ` ${getNowTime()} | i got you | ${decodeDataFrame(data1).PayloadData} `
                })); 
                //帧
                // let FIN = data1[0]&0x001//位运算
                // let opcode=data1[0]&0xF0
            })
        }
    })
    // error
    socket.on('error',(err)=>{
      console.log(err);
    });

    //断开
    socket.on('end',() =>{
        console.log('客户端断开')
    })
});

server.listen(8080);