import { DiscordWebhookMessage, DiscordEmbed, DiscordActionRow, MessageData } from "@/types/discord";
import { hexToRgb } from "./constants";
import { apiRequest } from "./queryClient";

export const formatDiscordTimestamp = (): string => {
  return new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatColor = (colorHex: string): number => {
  if (!colorHex || colorHex === "") return 0;
  try {
    return hexToRgb(colorHex);
  } catch (e) {
    console.error("Invalid color format:", colorHex);
    return 0;
  }
};

export const formatEmbed = (embed: DiscordEmbed): DiscordEmbed => {
  const formatted: DiscordEmbed = { ...embed };

  // Convert color hex to integer if it exists
  if (embed.color && typeof embed.color === "string") {
    formatted.color = formatColor(embed.color as unknown as string);
  }

  // Remove empty fields
  if (formatted.fields) {
    formatted.fields = formatted.fields.filter(
      (field) => field.name.trim() !== "" && field.value.trim() !== ""
    );
  }

  // Remove empty objects
  if (
    formatted.author &&
    !formatted.author.name &&
    !formatted.author.url &&
    !formatted.author.icon_url
  ) {
    delete formatted.author;
  }

  if (formatted.footer && !formatted.footer.text && !formatted.footer.icon_url) {
    delete formatted.footer;
  }

  if (formatted.image && !formatted.image.url) {
    delete formatted.image;
  }

  if (formatted.thumbnail && !formatted.thumbnail.url) {
    delete formatted.thumbnail;
  }

  return formatted;
};

export const prepareWebhookMessage = (
  messageData: MessageData
): DiscordWebhookMessage => {
  const { content, username, avatarUrl, embeds, components } = messageData;

  const formattedEmbeds = embeds
    .filter((embed) => {
      // Keep embed if it has any content
      return (
        embed.title ||
        embed.description ||
        (embed.fields && embed.fields.length > 0) ||
        embed.image?.url ||
        embed.thumbnail?.url ||
        embed.author?.name ||
        embed.footer?.text
      );
    })
    .map(formatEmbed);

  return {
    content: content || undefined,
    username: username || undefined,
    avatar_url: avatarUrl || undefined,
    embeds: formattedEmbeds.length > 0 ? formattedEmbeds : undefined,
    components: components.length > 0 ? components : undefined,
  };
};

export const sendWebhookMessage = async (
  webhookUrl: string,
  messageData: MessageData
): Promise<any> => {
  try {
    const webhookMessage = prepareWebhookMessage(messageData);
    const response = await apiRequest("POST", "/api/webhooks/send", {
      url: webhookUrl,
      message: webhookMessage,
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to send webhook message:", error);
    throw error;
  }
};

export const isValidWebhookUrl = (url: string): boolean => {
  const webhookRegex =
    /^https:\/\/(?:ptb\.|canary\.)?discord\.com\/api\/webhooks\/\d+\/.+$/;
  return webhookRegex.test(url);
};
