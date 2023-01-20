require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");
const Listener = require("./listener");

const init = async () => {
    console.log("Consumer berjalan");
    const playlistsService = new PlaylistsService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistsService, mailSender);

    const connectionn = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connectionn.createChannel();
    await channel.assertQueue("export:playlist", {
        durable: true,
    });

    channel.consume("export:playlist", listener.listen, { noAck: true });
};

init();
