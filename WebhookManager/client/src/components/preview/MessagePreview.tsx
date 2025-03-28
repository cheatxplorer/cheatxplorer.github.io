import { formatDiscordTimestamp } from "@/lib/discord";

interface MessagePreviewProps {
  username: string;
  avatarUrl: string;
  content: string;
}

export default function MessagePreview({ username, avatarUrl, content }: MessagePreviewProps) {
  return (
    <div className="flex mb-4">
      <img
        src={avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
        alt="Webhook Avatar"
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div className="flex items-center">
          <span className="font-semibold text-white">{username}</span>
          <span className="text-xs text-zinc-400 ml-2">Today at {formatDiscordTimestamp()}</span>
        </div>
        {content && <div className="mt-1 whitespace-pre-wrap">{content}</div>}
      </div>
    </div>
  );
}
