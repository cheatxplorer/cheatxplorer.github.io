export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

export type ButtonStyle = 'primary' | 'secondary' | 'success' | 'danger' | 'link';

export interface DiscordButton {
  type: 2;
  style: number;
  label: string;
  custom_id?: string;
  url?: string;
  disabled?: boolean;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
}

export interface DiscordActionRow {
  type: 1;
  components: DiscordButton[];
}

export interface DiscordWebhookMessage {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: DiscordEmbed[];
  components?: DiscordActionRow[];
}

export interface Webhook {
  id: number;
  url: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export type ButtonStyleMapping = {
  [key in ButtonStyle]: number;
};

export interface MessageData {
  content: string;
  username: string;
  avatarUrl: string;
  embeds: DiscordEmbed[];
  components: DiscordActionRow[];
}

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface ComponentButton {
  label: string;
  style: ButtonStyle;
  url?: string;
  custom_id?: string;
}

export interface ComponentRow {
  type: 'ACTION_ROW';
  components: ComponentButton[];
}
