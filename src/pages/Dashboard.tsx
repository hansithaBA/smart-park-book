import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Car, LogOut, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ParkingLotCard from "@/components/ParkingLotCard";
import BookingModal from "@/components/BookingModal";
import MyBookings from "@/components/MyBookings";

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  total_slots: number;
  hourly_rate: number;
}

interface ParkingSlot {
  id: string;
  lot_id: string;
  slot_number: string;
  floor: string;
  slot_type: string;
  is_active: boolean;
}

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [bookedSlotIds, setBookedSlotIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"lots" | "bookings">("lots");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [lotsRes, slotsRes, bookingsRes] = await Promise.all([
      supabase.from("parking_lots").select("*"),
      supabase.from("parking_slots").select("*").eq("is_active", true),
      supabase.from("bookings").select("*, parking_slots(slot_number, floor, slot_type, parking_lots(name, address))").eq("status", "active"),
    ]);

    if (lotsRes.data) setLots(lotsRes.data);
    if (slotsRes.data) setSlots(slotsRes.data);
    if (bookingsRes.data) {
      setBookings(bookingsRes.data as unknown as Booking[]);
      setBookedSlotIds(new Set(bookingsRes.data.map((b: any) => b.slot_id)));
    }
    setLoading(false);
  };

  const handleBook = async (startTime: string, endTime: string, vehicleNumber: string) => {
    if (!selectedSlot || !selectedLot || !user) return;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 3600000));
    const totalCost = hours * selectedLot.hourly_rate;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      slot_id: selectedSlot.id,
      start_time: startTime,
      end_time: endTime,
      total_cost: totalCost,
      vehicle_number: vehicleNumber || null,
    });

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booked!", description: `Slot ${selectedSlot.slot_number} reserved successfully.` });
      setSelectedSlot(null);
      fetchData();
    }
  };

  const handleCancel = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cancelled", description: "Booking has been cancelled." });
      fetchData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">ParkSmart</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "lots" ? "default" : "secondary"}
            onClick={() => setActiveTab("lots")}
            className="gap-2"
          >
            <MapPin className="w-4 h-4" /> Parking Lots
          </Button>
          <Button
            variant={activeTab === "bookings" ? "default" : "secondary"}
            onClick={() => setActiveTab("bookings")}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" /> My Bookings
            {bookings.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </Button>
        </div>

        {activeTab === "lots" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {lots.map((lot) => (
              <ParkingLotCard
                key={lot.id}
                lot={lot}
                slots={slots.filter((s) => s.lot_id === lot.id)}
                bookedSlotIds={bookedSlotIds}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setSelectedLot(lot);
                }}
              />
            ))}
          </motion.div>
        ) : (
          <MyBookings bookings={bookings} onCancel={handleCancel} />
        )}
      </div>

      {selectedSlot && selectedLot && (
        <BookingModal
          slot={selectedSlot}
          lot={selectedLot}
          onClose={() => setSelectedSlot(null)}
          onBook={handleBook}
        />
      )}
    </div>
  );
};

export default Dashboard;
