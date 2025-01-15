const PiranhaMessage = require('../../Utils/PiranhaMessage')
const ByteStream = require("../../Utils/ByteStream")
const config = require("../../config.json")

class LoginFailedMessage extends PiranhaMessage {
  constructor (session, msg, errCode) {
    super(session)
    this.id = 20103 // айди пакета
    this.session = session // сессия
    this.msg = msg // сообщение
    this.errCode = errCode // ошибочный код
    this.version = 0 // версия
    this.stream = new ByteStream() // битстрим
  }
  // << Error Code List >>
  // # 1  = Custom Message
  // # 7  = Patch
  // # 8  = Update Available
  // # 9  = Redirect
  // # 10 = Maintenance
  // # 11 = Banned
  // # 13 = Acc Locked PopUp
  // # 16 = Updating Cr/Maintenance/Too high version
  // # 18 = Chinese Text?
  async encode () {
    this.stream.writeInt(this.errCode)

    this.stream.writeString() // фингер принт
    this.stream.writeString() // ???

    this.stream.writeString() // ссылка на патч (Обновление файлов в игре)
    this.stream.writeString(config.updateLink) // Ссылка на обновление
    this.stream.writeString(this.msg)

    this.stream.writeInt(3600) // время окночание тех работ
    this.stream.writeBoolean(false) // включен ли?

    this.stream.writeString()
    this.stream.writeString()

    this.stream.writeInt(0)
    this.stream.writeInt(3)

    this.stream.writeString()
    this.stream.writeString()

    this.stream.writeInt(0)
    this.stream.writeInt(0)

    this.stream.writeBoolean(false)
    this.stream.writeBoolean(false)
  }
}

module.exports = LoginFailedMessage // для будущих импортов
