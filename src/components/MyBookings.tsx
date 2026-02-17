import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Booking {
  id: string;
  slot_id: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: string;
  vehicle_number: string | null;
  created_at: string;
  parking_slots?: {
    slot_number: string;
    floor: string;
    slot_type: string;
    parking_lots?: {
      name: string;
      address: string;
    };
  };
}

interface Props {
  bookings: Booking[];
  onCancel: (id: string) => void;
  onComplain: (bookingId: string, slotInfo: string) => void;
}

const MyBookings = ({ bookings, onCancel, onComplain }: Props) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold mb-1">No Active Bookings</h3>
        <p className="text-sm text-muted-foreground">Book a parking slot to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b, i) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-semibold">
                  Slot {b.parking_slots?.slot_number}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {b.parking_slots?.slot_type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {b.parking_slots?.parking_lots?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-display font-bold text-primary">
                ${b.total_cost}
              </div>
              {b.vehicle_number && (
                <div className="text-xs text-muted-foreground">{b.vehicle_number}</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {format(new Date(b.start_time), "MMM d, h:mm a")} → {format(new Date(b.end_time), "h:mm a")}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(b.id)}
              className="gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancel Booking
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplain(b.id, `Slot ${b.parking_slots?.slot_number} - ${b.parking_slots?.parking_lots?.name}`)}
              className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MyBookings;
