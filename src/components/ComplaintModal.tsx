import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  bookingId: string;
  slotInfo: string;
  onClose: () => void;
  onSubmit: (bookingId: string, description: string) => void;
}

const ComplaintModal = ({ bookingId, slotInfo, onClose, onSubmit }: Props) => {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    await onSubmit(bookingId, description.trim());
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="font-display font-bold text-lg">Report Issue</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Report unauthorized parking at <span className="text-foreground font-medium">{slotInfo}</span>
          </p>

          <Textarea
            placeholder="Describe the issue (e.g., Someone else is parked in my reserved slot, vehicle plate number if visible...)"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            className="mb-2 min-h-[120px] bg-background/50"
          />
          <p className="text-xs text-muted-foreground mb-4 text-right">{description.length}/500</p>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!description.trim() || submitting}
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplaintModal;
