import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Webhook } from "@/types/discord";
import { DEFAULT_USERNAME, DEFAULT_AVATAR } from "@/lib/constants";
import { isValidWebhookUrl } from "@/lib/discord";

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [currentWebhook, setCurrentWebhook] = useState<Webhook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addWebhook = async (url: string, name = DEFAULT_USERNAME, avatar = DEFAULT_AVATAR) => {
    if (!isValidWebhookUrl(url)) {
      toast({
        title: "Invalid Webhook URL",
        description: "Please enter a valid Discord webhook URL",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name, avatar }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add webhook: ${response.statusText}`);
      }

      const webhook = await response.json();
      setWebhooks([...webhooks, webhook]);
      setCurrentWebhook(webhook);
      toast({
        title: "Webhook Added",
        description: `Successfully added webhook "${name}"`,
      });
      closeModal();
      return true;
    } catch (error) {
      console.error("Error adding webhook:", error);
      toast({
        title: "Error",
        description: "Failed to add webhook",
        variant: "destructive",
      });
      return false;
    }
  };

  const selectWebhook = (webhook: Webhook) => {
    setCurrentWebhook(webhook);
  };

  const removeWebhook = (id: number) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    if (currentWebhook && currentWebhook.id === id) {
      setCurrentWebhook(null);
    }
  };

  // Mock function to get previously stored webhooks
  const loadWebhooks = async () => {
    try {
      const response = await fetch("/api/webhooks");
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data);
      }
    } catch (error) {
      console.error("Error loading webhooks:", error);
    }
  };

  // Load webhooks on initial mount
  useEffect(() => {
    loadWebhooks();
  }, []);

  return {
    webhooks,
    currentWebhook,
    isModalOpen,
    openModal,
    closeModal,
    addWebhook,
    selectWebhook,
    removeWebhook,
  };
}

export type UseWebhooksReturn = ReturnType<typeof useWebhooks>;
