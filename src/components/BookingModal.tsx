import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Clock, Car } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  slot: { id: string; slot_number: string; floor: string; slot_type: string };
  lot: { name: string; hourly_rate: number };
  onClose: () => void;
  onBook: (startTime: string, endTime: string, vehicleNumber: string) => void;
}

const BookingModal = ({ slot, lot, onClose, onBook }: Props) => {
  const now = new Date();
  const defaultStart = new Date(now.getTime() + 15 * 60000).toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 75 * 60000).toISOString().slice(0, 16);

  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const hours = Math.max(1, Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / 3600000));
  const totalCost = hours * lot.hourly_rate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onBook(startTime, endTime, vehicleNumber);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div>
            <h3 className="font-display font-semibold text-lg">Book Slot {slot.slot_number}</h3>
            <p className="text-sm text-muted-foreground">{lot.name} • Floor {slot.floor === "G" ? "Ground" : slot.floor}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="flex items-center gap-2">
              <Car className="w-4 h-4" /> Vehicle Number
            </Label>
            <Input
              id="vehicle"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. ABC-1234"
              className="bg-secondary border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start" className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Start
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-secondary border-border text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-secondary border-border text-sm"
                required
              />
            </div>
          </div>

          <div className="glass-card rounded-lg p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Duration</span>
              <span>{hours} hour{hours > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Rate</span>
              <span>${lot.hourly_rate}/hr</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="text-primary">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Booking..." : `Confirm Booking • $${totalCost.toFixed(2)}`}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;
