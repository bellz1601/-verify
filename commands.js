import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("setup-form")
    .setDescription("ส่งฟอร์มสมัคร IC แบบเงียบ")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
];

export async function handleSetupForm(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const button = new ButtonBuilder()
    .setCustomId("open_ic_form")
    .setLabel("📋 กรอกข้อมูล IC")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  const embed = new EmbedBuilder()
    .setColor(0xFF4F8B)
    .setTitle("🍭 CHUPACHUPS TOWN | WHITELIST")
    .setDescription(
      "กดปุ่มด้านล่างเพื่อกรอกข้อมูล IC / OC\n" +
      "หลังจากทีมงานตรวจสอบ จะได้รับยศอัตโนมัติ"
    );

  await interaction.channel.send({ embeds: [embed], components: [row] });
  await interaction.deleteReply();
}

export function buildICFormModal() {
  const modal = new ModalBuilder()
    .setCustomId("ic_form_modal")
    .setTitle("กรอกข้อมูลตัวละคร");

  const fields = [
    ["ic_name", "ชื่อ IC"],
    ["age", "อายุ IC / OC"],
    ["steam", "ลิ้ง Steam"],
    ["facebook", "Facebook IC / OC"],
  ];

  modal.addComponents(
    ...fields.map(([id, label]) =>
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
    )
  );

  return modal;
}

export function buildAdminEmbed({ icName, age, steam, facebook, user }) {
  const approveBtn = new ButtonBuilder()
    .setCustomId(`approve_${user.id}`)
    .setLabel("✅ รับยศ")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(approveBtn);

  const embed = new EmbedBuilder()
    .setColor(0x2ECC71)
    .setTitle("🧾 Whitelist ใหม่")
    .addFields(
      { name: "ชื่อ IC", value: icName },
      { name: "อายุ IC/OC", value: age },
      { name: "Steam", value: steam },
      { name: "Facebook", value: facebook },
      { name: "Discord", value: `${user.tag} (${user.id})` }
    )
    .setTimestamp();

  return { embed, row };
}
