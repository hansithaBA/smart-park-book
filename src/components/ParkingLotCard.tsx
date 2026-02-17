import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface ParkingSlot {
  id: string;
  lot_id: string;
  slot_number: string;
  floor: string;
  slot_type: string;
  is_active: boolean;
}

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  total_slots: number;
  hourly_rate: number;
}

interface Props {
  lot: ParkingLot;
  slots: ParkingSlot[];
  bookedSlotIds: Set<string>;
  onSelectSlot: (slot: ParkingSlot) => void;
}

const slotTypeColors: Record<string, string> = {
  standard: "bg-success/20 border-success/40 text-success hover:bg-success/30",
  compact: "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30",
  handicap: "bg-warning/20 border-warning/40 text-warning hover:bg-warning/30",
};

const ParkingLotCard = ({ lot, slots, bookedSlotIds, onSelectSlot }: Props) => {
  const availableCount = slots.filter((s) => !bookedSlotIds.has(s.id)).length;

  // Group by floor
  const floors = slots.reduce<Record<string, ParkingSlot[]>>((acc, s) => {
    (acc[s.floor] = acc[s.floor] || []).push(s);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="p-5 border-b border-border/50">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-semibold text-lg">{lot.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {availableCount}/{slots.length} free
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {lot.address}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> ${lot.hourly_rate}/hr
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {Object.entries(floors).map(([floor, floorSlots]) => (
          <div key={floor}>
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              {floor === "G" ? "Ground Floor" : `Floor ${floor}`}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {floorSlots.map((slot) => {
                const isBooked = bookedSlotIds.has(slot.id);
                return (
                  <button
                    key={slot.id}
                    disabled={isBooked}
                    onClick={() => onSelectSlot(slot)}
                    className={`
                      relative p-2 rounded-lg border text-xs font-medium transition-all duration-200
                      ${isBooked
                        ? "bg-destructive/15 border-destructive/30 text-destructive/60 cursor-not-allowed"
                        : slotTypeColors[slot.slot_type] || slotTypeColors.standard
                      }
                      ${!isBooked ? "cursor-pointer hover:scale-105" : ""}
                    `}
                    title={`${slot.slot_number} (${slot.slot_type})${isBooked ? " - Occupied" : " - Available"}`}
                  >
                    {slot.slot_number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
          {[
            { label: "Available", cls: "bg-success/20 border-success/40" },
            { label: "Occupied", cls: "bg-destructive/15 border-destructive/30" },
            { label: "Compact", cls: "bg-primary/20 border-primary/40" },
            { label: "Handicap", cls: "bg-warning/20 border-warning/40" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={`w-3 h-3 rounded border ${l.cls}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ParkingLotCard;
