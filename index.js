import "dotenv/config";
import { Client, GatewayIntentBits, Events, ChannelType } from "discord.js";
import { handleSetupForm, buildICFormModal, buildAdminEmbed } from "./commands.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once(Events.ClientReady, () => console.log("✅ Bot online"));

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "setup-form") {
      return handleSetupForm(interaction);
    }

    if (interaction.isButton() && interaction.customId === "open_ic_form") {
      return interaction.showModal(buildICFormModal());
    }

    if (interaction.isModalSubmit() && interaction.customId === "ic_form_modal") {
      const data = {
        icName: interaction.fields.getTextInputValue("ic_name"),
        age: interaction.fields.getTextInputValue("age"),
        steam: interaction.fields.getTextInputValue("steam"),
        facebook: interaction.fields.getTextInputValue("facebook"),
        user: interaction.user,
      };

      const adminChannel = interaction.guild.channels.cache.get(process.env.ADMIN_CHANNEL_ID);
      const { embed, row } = buildAdminEmbed(data);

      if (adminChannel && adminChannel.type === ChannelType.GuildText) {
        await adminChannel.send({ embeds: [embed], components: [row] });
      }

      return interaction.reply({ content: "✅ ส่งข้อมูลแล้ว รอแอดมินอนุมัติ", ephemeral: true });
    }

    if (interaction.isButton() && interaction.customId.startsWith("approve_")) {
      const userId = interaction.customId.split("_")[1];
      const member = await interaction.guild.members.fetch(userId);
      await member.roles.add(process.env.APPROVED_ROLE_ID);

      return interaction.update({
        content: "✅ อนุมัติแล้ว และให้ยศเรียบร้อย",
        components: [],
        embeds: interaction.message.embeds,
      });
    }
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable()) {
      await interaction.reply({ content: "❌ เกิดข้อผิดพลาด", ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
