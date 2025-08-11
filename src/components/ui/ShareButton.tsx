import { Share2 } from "lucide-react";
import { Button } from "./button";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text?: string;
}

const ShareButton = ({ title, text }: ShareButtonProps) => {
  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "URL copied to clipboard." });
      } catch {
        toast({ title: "Unable to copy", description: url });
      }
    }
  };

  return (
    <Button variant="secondary" onClick={onShare} aria-label="Share this page">
      <Share2 /> Share
    </Button>
  );
};

export default ShareButton;
