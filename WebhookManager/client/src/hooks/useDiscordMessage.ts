import { useState } from "react";
import { DiscordEmbed, DiscordActionRow, MessageData, ComponentRow, EmbedField, ComponentButton } from "@/types/discord";
import { DEFAULT_USERNAME, DEFAULT_AVATAR, BUTTON_STYLES } from "@/lib/constants";

export function useDiscordMessage() {
  const [content, setContent] = useState<string>("");
  const [username, setUsername] = useState<string>(DEFAULT_USERNAME);
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);
  const [components, setComponents] = useState<ComponentRow[]>([]);

  // Message content methods
  const updateContent = (newContent: string) => {
    setContent(newContent);
  };

  // Profile methods
  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
  };

  const updateAvatarUrl = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  // Embed methods
  const addEmbed = () => {
    setEmbeds([...embeds, { color: 0x58b9ff }]);
  };

  const updateEmbed = (index: number, updatedEmbed: Partial<DiscordEmbed>) => {
    const newEmbeds = [...embeds];
    newEmbeds[index] = { ...newEmbeds[index], ...updatedEmbed };
    setEmbeds(newEmbeds);
  };

  const removeEmbed = (index: number) => {
    setEmbeds(embeds.filter((_, i) => i !== index));
  };

  const duplicateEmbed = (index: number) => {
    const embedToDuplicate = embeds[index];
    setEmbeds([...embeds.slice(0, index + 1), { ...embedToDuplicate }, ...embeds.slice(index + 1)]);
  };

  // Embed fields methods
  const addField = (embedIndex: number) => {
    const newEmbeds = [...embeds];
    if (!newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = [];
    }
    newEmbeds[embedIndex].fields?.push({ name: "", value: "", inline: false });
    setEmbeds(newEmbeds);
  };

  const updateField = (embedIndex: number, fieldIndex: number, updatedField: Partial<EmbedField>) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex].fields && newEmbeds[embedIndex].fields![fieldIndex]) {
      newEmbeds[embedIndex].fields![fieldIndex] = {
        ...newEmbeds[embedIndex].fields![fieldIndex],
        ...updatedField,
      };
      setEmbeds(newEmbeds);
    }
  };

  const removeField = (embedIndex: number, fieldIndex: number) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields?.filter(
        (_, i) => i !== fieldIndex
      );
      setEmbeds(newEmbeds);
    }
  };

  // Component methods
  const addComponentRow = () => {
    setComponents([...components, { type: 'ACTION_ROW', components: [] }]);
  };

  const addButton = (rowIndex: number, button: ComponentButton) => {
    const newComponents = [...components];
    newComponents[rowIndex].components.push(button);
    setComponents(newComponents);
  };

  const updateButton = (rowIndex: number, buttonIndex: number, updatedButton: Partial<ComponentButton>) => {
    const newComponents = [...components];
    newComponents[rowIndex].components[buttonIndex] = {
      ...newComponents[rowIndex].components[buttonIndex],
      ...updatedButton,
    };
    setComponents(newComponents);
  };

  const removeButton = (rowIndex: number, buttonIndex: number) => {
    const newComponents = [...components];
    newComponents[rowIndex].components = newComponents[rowIndex].components.filter(
      (_, i) => i !== buttonIndex
    );
    setComponents(newComponents);
  };

  const removeComponentRow = (rowIndex: number) => {
    setComponents(components.filter((_, i) => i !== rowIndex));
  };

  // Converts internal component representation to Discord API format
  const getFormattedComponents = (): DiscordActionRow[] => {
    return components.map(row => ({
      type: 1,
      components: row.components.map(button => ({
        type: 2,
        style: BUTTON_STYLES[button.style],
        label: button.label,
        url: button.style === 'link' ? button.url : undefined,
        custom_id: button.style !== 'link' ? button.custom_id || `button_${Math.random().toString(36).substring(2, 9)}` : undefined,
      }))
    })).filter(row => row.components.length > 0) as DiscordActionRow[];
  };

  const clearAll = () => {
    setContent("");
    setUsername(DEFAULT_USERNAME);
    setAvatarUrl(DEFAULT_AVATAR);
    setEmbeds([]);
    setComponents([]);
  };

  const getMessageData = (): MessageData => {
    return {
      content,
      username,
      avatarUrl,
      embeds,
      components: getFormattedComponents(),
    };
  };

  return {
    content,
    username,
    avatarUrl,
    embeds,
    components,
    updateContent,
    updateUsername,
    updateAvatarUrl,
    addEmbed,
    updateEmbed,
    removeEmbed,
    duplicateEmbed,
    addField,
    updateField,
    removeField,
    addComponentRow,
    addButton,
    updateButton,
    removeButton,
    removeComponentRow,
    getFormattedComponents,
    clearAll,
    getMessageData,
  };
}

export type UseDiscordMessageReturn = ReturnType<typeof useDiscordMessage>;
