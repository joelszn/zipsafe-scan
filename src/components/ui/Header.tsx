import { Link } from "react-router-dom";
import { useState } from "react";
import Container from "./Container";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Input } from "./input";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show a success toast
    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback. We'll review it soon.",
    });
    
    setFeedback("");
    setEmail("");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <Container className="flex h-14 md:h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="RiskByZip Home">
          <img src="/lovable-uploads/bd414dec-2211-477a-9f72-d9d4d3b7d4b0.png" alt="RiskByZip logo" className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-semibold text-sm md:text-base">RiskByZip</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Link to="/methodology" className="text-xs md:text-sm hover:underline px-2 py-1 min-h-[44px] flex items-center">Methodology</Link>
          <Link to="/prep" className="text-xs md:text-sm hover:underline px-2 py-1 min-h-[44px] flex items-center">Preparation</Link>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="font-medium text-xs md:text-sm min-h-[44px] px-3 md:px-4">
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogDescription>
                  Help us improve RiskByZip. Your feedback is valuable to us.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Feedback</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
