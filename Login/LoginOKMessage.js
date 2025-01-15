const PiranhaMessage = require('../../Utils/PiranhaMessage')
const ByteStream = require("../../Utils/ByteStream")

class LoginOKMessage extends PiranhaMessage {
  constructor (session) {
    super(session)
    this.id = 20104 // айди пакета
    this.session = session // айди сессии
    this.version = 1 // айди версии 
    this.stream = new ByteStream() // byte stream
  }

  async encode () {

    this.stream.writeLong(0, this.session.lowID) //LowID
    this.stream.writeLong(0, this.session.lowID)
    this.stream.writeString(this.session.token) //Token

    this.stream.writeString() //Facebook ID
    this.stream.writeString() //Gamecenter ID

    this.stream.writeInt(19) 
    this.stream.writeInt(110) 
    this.stream.writeInt(0)

    this.stream.writeString("dev")

    this.stream.writeInt(0)
    this.stream.writeInt(0)
    this.stream.writeInt(0)

    this.stream.writeString()
    this.stream.writeString()
    this.stream.writeString()
    
    this.stream.writeInt(0)

    this.stream.writeString()
    this.stream.writeString("RU") // Регион
    this.stream.writeString()// ск айди

    this.stream.writeInt(2)//Tier
    this.stream.writeString()
    this.stream.writeInt(2)//Url Entry Array Count
    this.stream.writeString("https://game-assets.brawlstarsgame.com")
    this.stream.writeString("")
    this.stream.writeInt(2)//Url Entry Array Count
    this.stream.writeString("")
    this.stream.writeString("")
    this.stream.writeVInt(0)//Seconds Until Account Deletion
  }
}

module.exports = LoginOKMessage
