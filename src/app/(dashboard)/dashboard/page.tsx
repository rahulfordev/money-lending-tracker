"use client";
import { BorrowerList } from "@/components/borrowers/BorrowerList";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <BorrowerList />
    </div>
  );
}
