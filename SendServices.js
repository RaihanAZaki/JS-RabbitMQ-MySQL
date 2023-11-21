const amqp = require("amqplib");
const mysql = require("mysql2");

const rabbitMQUrl = "amqp://guest:rehan@localhost:5672/";

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rehan",
  database: "atms",
  port: 20222
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Error koneksi ke database MySQL:", err);
    return;
  }
  console.log("Koneksi ke database MySQL berhasil!");

  // Membaca data dari MySQL
  mysqlConnection.query("SELECT id, username, email, password FROM user", (err, results, fields) => {
    if (err) {
      console.error("Error query MySQL:", err);
      return;
    }

    mysqlConnection.end();

    amqp
      .connect(rabbitMQUrl)
      .then((conn) => {
        return conn
          .createChannel()
          .then((channel) => {
            const queue = "Pesan";
            const message = JSON.stringify(results);
            const ok = channel.assertQueue(queue, { durable: false });
            return ok.then(() => {
              channel.sendToQueue(queue, Buffer.from(message));
              console.log("Data terkirim ke RabbitMQ!");
              return channel.close();
            });
          })
          .finally(() => conn.close());
      })
      .catch((err) => {
        console.error("Error koneksi ke RabbitMQ:", err);
      });
  });
});
