import { DiscordEmbed } from "@/types/discord";
import { rgbToHex } from "@/lib/constants";
import { formatDiscordTimestamp } from "@/lib/discord";

interface EmbedPreviewProps {
  embed: DiscordEmbed;
}

export default function EmbedPreview({ embed }: EmbedPreviewProps) {
  const colorHex = typeof embed.color === 'number' ? rgbToHex(embed.color) : '#58b9ff';
  
  // Only render if the embed has at least some content
  if (!embed.title && !embed.description && !(embed.fields && embed.fields.length > 0) && 
      !embed.image?.url && !embed.thumbnail?.url && !embed.author?.name && !embed.footer?.text) {
    return null;
  }

  return (
    <div className="ml-13 pl-0 border-l-4 rounded-sm" style={{ borderColor: colorHex }}>
      <div className="bg-zinc-900 rounded-md ml-1 overflow-hidden">
        {/* Author */}
        {embed.author && embed.author.name && (
          <div className="px-4 pt-3 flex items-center">
            {embed.author.icon_url && (
              <img src={embed.author.icon_url} alt="Author Icon" className="w-6 h-6 rounded-full mr-2" />
            )}
            <a 
              href={embed.author.url || '#'} 
              className="text-white hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {embed.author.name}
            </a>
          </div>
        )}
        
        {/* Title */}
        {embed.title && (
          <div className="px-4 pt-2">
            <a 
              href={embed.url || '#'} 
              className="text-[#58b9ff] hover:underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {embed.title}
            </a>
          </div>
        )}
        
        {/* Description */}
        {embed.description && (
          <div className="px-4 pt-2 text-sm whitespace-pre-wrap">
            {embed.description}
          </div>
        )}
        
        {/* Fields */}
        {embed.fields && embed.fields.length > 0 && (
          <div className="px-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {embed.fields.map((field, index) => (
              <div 
                key={index} 
                className={`${field.inline ? 'col-span-1' : 'col-span-2'}`}
              >
                <div className="font-semibold text-sm">{field.name}</div>
                <div className="text-sm whitespace-pre-wrap">{field.value}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Image */}
        {embed.image && embed.image.url && (
          <div className="px-4 pt-2 pb-0">
            <img 
              src={embed.image.url} 
              alt="Embed Image" 
              className="rounded-md max-w-full h-auto mt-2" 
            />
          </div>
        )}

        {/* Thumbnail - in real Discord this would be positioned differently */}
        {embed.thumbnail && embed.thumbnail.url && !embed.image?.url && (
          <div className="px-4 pt-2 pb-0">
            <img 
              src={embed.thumbnail.url} 
              alt="Thumbnail" 
              className="rounded-md max-w-[80px] h-auto mt-2" 
            />
          </div>
        )}
        
        {/* Footer */}
        {embed.footer && embed.footer.text && (
          <div className="px-4 py-3 flex items-center">
            {embed.footer.icon_url && (
              <img src={embed.footer.icon_url} alt="Footer Icon" className="w-5 h-5 rounded-full mr-2" />
            )}
            <span className="text-zinc-400 text-xs">
              {embed.footer.text}
              {embed.timestamp && ` • ${embed.timestamp}`}
              {!embed.timestamp && ` • Today at ${formatDiscordTimestamp()}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
