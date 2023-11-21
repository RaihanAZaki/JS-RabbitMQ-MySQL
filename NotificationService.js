const amqp = require("amqplib");

amqp.connect("amqp://guest:rehan@localhost:5672/").then((conn) => {
  return conn.createChannel().then((channel) => {
    // deklarasi antrian
    const ok = channel.assertQueue("Pesan", { durable: false });
    ok.then(() => {
      // menangkap pesan yg dikirim rabbitMQ
      return channel.consume(
        "Pesan",
        (massage) => console.log("Pesan Masuk: ", massage.content.toString()),
        { noAck: true }
      );
    }).then(() => {
    });
  });
});
