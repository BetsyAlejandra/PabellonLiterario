const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error("❌ No se encontró el token de Discord.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    console.log(`📢 Canal encontrado: ${channel.name}`);
  } catch (error) {
    console.error("❌ Error obteniendo el canal:", error);
  }
});

client.login(token);

const sendUpdate = async (message) => {
  try {
    if (!client.isReady()) {
      console.error("⚠️ El bot no está listo aún.");
      return;
    }

    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    if (!channel) {
      console.error("⚠️ No se encontró el canal.");
      return;
    }

    await channel.send(message);
    console.log("✅ Mensaje enviado al canal.");
  } catch (error) {
    console.error("❌ Error enviando mensaje al canal:", error);
  }
};

module.exports = { sendUpdate };