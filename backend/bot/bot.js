const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
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


const sendUpdate = async (message) => {
  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      await channel.send(message);
    } else {
      console.error("⚠️ No se pudo encontrar el canal de Discord.");
    }
  } catch (error) {
    console.error("❌ Error enviando mensaje al canal:", error);
  }
};
console.log("🔹 DISCORD_BOT_TOKEN:", process.env.DISCORD_BOT_TOKEN ? "Cargado" : "No encontrado");
client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = { sendUpdate };