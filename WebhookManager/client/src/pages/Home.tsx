import { useState } from "react";
import Header from "@/components/Header";
import EditorPanel from "@/components/EditorPanel";
import PreviewPanel from "@/components/PreviewPanel";
import WebhookModal from "@/components/editor/WebhookModal";
import { useDiscordMessage } from "@/hooks/useDiscordMessage";
import { useWebhooks } from "@/hooks/useWebhooks";
import { sendWebhookMessage } from "@/lib/discord";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const discordMessage = useDiscordMessage();
  const webhookState = useWebhooks();
  const { toast } = useToast();

  const handleSend = async () => {
    if (!webhookState.currentWebhook) {
      toast({
        title: "No Webhook Selected",
        description: "Please add a webhook first",
        variant: "destructive",
      });
      webhookState.openModal();
      return;
    }

    setIsSending(true);
    try {
      const messageData = discordMessage.getMessageData();
      await sendWebhookMessage(webhookState.currentWebhook.url, messageData);
      toast({
        title: "Message Sent",
        description: "Your webhook message was sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error Sending Message",
        description: error.message || "Failed to send webhook message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClearAll = () => {
    discordMessage.clearAll();
    toast({
      title: "Cleared",
      description: "All message content has been cleared",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <Header />
      
      <div className="flex flex-col lg:flex-row flex-1">
        <EditorPanel 
          discordMessage={discordMessage}
          webhookState={webhookState}
          onSend={handleSend}
          onClearAll={handleClearAll}
          isSending={isSending}
        />
        
        <PreviewPanel 
          messageData={discordMessage.getMessageData()}
        />
      </div>
      
      <WebhookModal 
        isOpen={webhookState.isModalOpen}
        onClose={webhookState.closeModal}
        onAddWebhook={webhookState.addWebhook}
      />
    </div>
  );
}
