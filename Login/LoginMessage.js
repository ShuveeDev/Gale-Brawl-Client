//Тут показано и ракссказано как работает вход на севрер


const PiranhaMessage = require('../../Utils/PiranhaMessage'); //Запрос пиранхи мессндж 
const ByteStream = require("../../Utils/ByteStream"); // импорт би стрим отвечает за прием и обработку всех пакетов
const LoginFailedMessage = require("./LoginFailedMessage"); // импорт неудачного входа
const LoginOKMessage = require("./LoginOKMessage"); // импорт удачного входа
const OwnHomeDataMessage = require("../Home/OwnHomeDataMessage"); // импорт структуры лобби в каждой версии она разная
const crypto = require('crypto'); // импорт крипты (не ворк)

const fs = require('fs'); 
 
class LoginMessage extends PiranhaMessage { 
  constructor (bytes, session) { 
    super(session); //сессия
    this.id = 10101; // айди пакета
    this.version = 0; //определение версии
    this.stream = new ByteStream(bytes); 
  } 
 
  async decode () { // обработка пакета 10101
    this.stream.readInt(); 
    this.session.lowID = this.stream.readInt(); // Лоу айди (Значение тега в базе данных)
    this.session.token = this.stream.readString(); // токен (является вашим ключом доступа к вашему аккаунту. без него ничего не работает)
 
    this.major = this.stream.readInt(); // Версия игры
    this.minor = this.stream.readInt(); // Минор
    this.build = this.stream.readInt(); // Билд игры
    this.fingerprint_sha = this.stream.readString(); // Фингерпринт версия
    this.DeviceModel = this.stream.readString(); // Модель вашего устройства
    this.isAndroid = this.stream.readVInt(); // Андроид ли?
  } 
 
  async process () { 
    if (this.isAndroid !== 0 & this.fingerprint_sha !== config.cryptoKey || this.major !== config.major) { 
      return await new LoginFailedMessage(this.session, `На нашем сервере вышел апдейт`, 8).send(); 
    } //пример отправки неудачного входа обновы
 
    if (!this.session.token) { 
      this.session.token = crypto.randomBytes(Math.ceil(36/2)).toString('hex').slice(0, 36); 
      await database.createAccount(this.session.token); 
    } //создание аккаунта 
 
    const account = await database.getAccountToken(this.session.token); 
    if (account == null) return await new LoginFailedMessage(this.session, `Ваш аккаунт не найден, нужно удалить данные об игре!`, 18).send(); //отправка неудачного входа если нету аккаунта
 
    this.session.lowID = account.lowID; // захват лоу айди
    this.session.Resources = account.Resources; // захват ресурсов в игре
    await new LoginOKMessage(this.session).send(); // отправка удачного входа
    await new OwnHomeDataMessage(this.session, account).send(); // отправка ОХД (Лобби информации)
 
module.exports = LoginMessage; //експорт для будущих импортов 
